import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import styles from '@/pages/board/boardList.module.css';
import axios from 'axios';
import { useBoard } from '../../hooks/useBoard';
import { useLocation, useNavigate, useParams } from 'react-router';
import { loadingStore } from '../../store/loadingStore';
import CustomAlert from '../../components/alert/CustomAlert';
import { boardStore } from '../../store/boardStore';


// Quill Size 설정
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['16px', '18px', '20px', '24px', '32px'];
Quill.register(Size, true);

function BoardForm({ type }) {
  const location = useLocation();
  const params = useParams();

  const { toggleRefresh } = boardStore();

  const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imgFile, setImgFile] = useState([]);
  const [boardDetail, setBoardDetail] = useState({});


  const { getMutate, updateMutate, uploadImgMutate, deleteMutate } = useBoard();

  const navigate = useNavigate();

  const adminPage = location.pathname.split('/').slice(0, 3).join('/') === '/admin/board';
  
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // 설정값
  const USE_MOCK = true;
  const authToken = null;
  const uploadUrl = '/api/v1/book/ed/img';
  const maxWidth = 1600;
  const maxHeight = 1600;
  const outMime = 'image/png';
  const quality = 0.9;

  /** Quill 인스턴스를 안전하게 획득 */
  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = quillRef.current.getEditor();
      setIsReady(true); // editor 준비 완료
    }
  }, []);

  /** Mock 이미지 업로드 (Base64) */
  const mockUploadImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.readAsDataURL(file);

      //읽은 결과 성공
      reader.onload = (e) => {
        console.log(e.target.result)
        resolve(e.target.result);
      };
      
      //읽은 결과 실패 
      reader.onerror = () => {
        reject(new Error('파일 읽기 실패'));
      };
      
      
    });
  }, []);


  // 이미지 cloudinary에 업로드 요청
  const uploadCloudinary = async(file) => {
    const formData = new FormData();
    formData.append('file', file);

    const urlList = await uploadImgMutate.mutateAsync({
      brdId: params.boardId,
      formData: formData
    });

    return urlList;
  }

  /** 서버 업로드 함수 */
  const uploadFile = useCallback(async (file) => {
      console.log('🎭 Mock 모드: 이미지를 Base64로 변환 중...');
      const url = await mockUploadImage(file);

      console.log('✅ Mock 업로드 성공');
    
    return url;
  }, [USE_MOCK, mockUploadImage, authToken, uploadUrl]);


  /** 이미지 리사이즈 시 변경된 url을 감지해 cloudinary가 자동으로 리사이즈 요청을 받음 */
  const reuploadResizedImage = useCallback(async (imgElement, newWidth, newHeight) => {

      if(isLoading) {
        CustomAlert({
          text: "이미지 업로드중입니다. 잠시후에 다시 시도해주세요."
        })        
        return false;
      }
      const originalSrc = imgElement.src; 

      // 리사이즈 이미지 cloudinary에 리사이징 요청
      const newUrl = originalSrc.replace(/w_\d+/, `w_${newWidth}`).replace(/h_\d+/, `h_${newHeight}`);

      // 새 URL로 교체
      imgElement.src = newUrl;
      console.log('✅ 리사이즈 후 재업로드 완료');

  }, [uploadFile, outMime, quality]);


  /** 이미지 업로드 → URL 삽입 */
  const uploadAndInsert = useCallback(
    async (file) => {      
      const editor = quillInstanceRef.current;
      if (!editor) {
        CustomAlert({
          text: '에디터가 준비되지 않았습니다. 잠시 후 다시 시도해주세요.'
        })
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        CustomAlert({
          text: '이미지 크기는 5MB를 초과할 수 없습니다.'
        })
        return;
      }

      if (!file.type.startsWith('image/')) {
        CustomAlert({
          text: '이미지 파일만 업로드할 수 있습니다.'
        })
        return;
      }


        // 이미지 업로드
        const MockUrl = await uploadFile(file);

        // 에디터에 이미지 삽입
        const range = editor.getSelection(true);
        console.log(range)
        if (range) {
          editor.insertEmbed(range.index, 'image', MockUrl);
          editor.setSelection(range.index + 1);
        } else {
          const lastIndex = editor.getLength();
          editor.insertEmbed(lastIndex, "image", MockUrl);
          editor.setSelection(lastIndex + 1);
        }
        
        const img = editor.root.querySelector(`img[src="${MockUrl}"]`); // 미리보기 이미지
        // 미리보기 이미지를 덮어쓰기 위한 이미지 이름 저장
        const uniqueId = Date.now() + Math.random();
        if (img) {
          img.dataset.fileName = file.name;
          img.dataset.id = uniqueId;
        }
        console.log('이미지 삽입 완료');

        // 이미지 업로드
        const uploadedData = await uploadCloudinary(file);
        const uploadedUrl = uploadedData.uploadedUrl;

        // 미리보기 이미지 찾기 → src 교체
        const sameImg = editor.root.querySelector(`img[data-id="${uniqueId}"]`);
        if (sameImg) {
          sameImg.src = uploadedUrl;
          sameImg.dataset.fileName = uploadedData.cloudinaryId;
        }

        console.log('✅ 이미지 업로드 완료, src 교체 완료');
    },
    [uploadFile]
  );


  /** 툴바의 이미지 버튼 핸들러 */
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        await uploadAndInsert(file);
      }
    };
    input.click();
  }, [uploadAndInsert]);

  /** 붙여넣기 이미지 처리 */
  useEffect(() => {
    if (!isReady) return;
    const editor = quillInstanceRef.current;
    if (!editor) return;

    const root = editor.root;
    const handlePaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          e.preventDefault();
          e.stopPropagation();

          const file = items[i].getAsFile();
          if (!file) continue;

          await uploadAndInsert(file);
          break;
        }
      }
    };

    root.addEventListener('paste', handlePaste, true);
    return () => root.removeEventListener('paste', handlePaste, true);
  }, [isReady, uploadAndInsert]);

  /** 드래그&드롭 이미지 처리 */
  useEffect(() => {
    if (!isReady) return;
    const editor = quillInstanceRef.current;
    if (!editor) return;

    const el = editor.root;
    let isUploading = false;

    const handleDrop = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isUploading) return;

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith('image/')) return;

      isUploading = true;

      try {
        await uploadAndInsert(file);
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        CustomAlert({
          text: '이미지 업로드에 실패했습니다.'
        })
        
      } finally {
        isUploading = false;
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener('drop', handleDrop, true);
    el.addEventListener('dragover', handleDragOver, true);
    return () => {
      el.removeEventListener('drop', handleDrop, true);
      el.removeEventListener('dragover', handleDragOver, true);
    };
  }, [isReady, uploadAndInsert]);

  /** 이미지 핸들 리사이즈 기능 */
  useEffect(() => {
    if (!isReady) return; // editor가 준비될 때까지 기다림
    const editor = quillInstanceRef.current;
    if (!editor) return;

    const editorElement = editor.root;

    // CSS 스타일 추가
    const style = document.createElement('style');
    style.id = 'quill-image-resize-style';
    style.textContent = `
      .ql-editor img {
        cursor: pointer;
        max-width: 100%;
      }
      .image-resize-overlay {
        position: absolute;
        box-sizing: border-box;
        border: 1px dashed #4285f4;
        z-index: 1000;
        pointer-events: none;
      }
      .image-resize-handle {
        position: absolute;
        width: 12px;
        height: 12px;
        background: white;
        border: 1px solid #4285f4;
        box-sizing: border-box;
        z-index: 1001;
        pointer-events: auto;
      }
      .image-resize-handle.nwse-resize { cursor: nwse-resize; }
      .image-resize-handle.nesw-resize { cursor: nesw-resize; }
      .image-resize-handle.ns-resize { cursor: ns-resize; }
      .image-resize-handle.ew-resize { cursor: ew-resize; }
    `;
    document.head.appendChild(style);

    let selectedImage = null;
    let overlay = null;
    let handles = [];
    let isResizing = false;
    let startX, startY, startWidth, startHeight, aspectRatio, resizePosition;

    const createOverlay = (img) => {
      // 기존 오버레이 제거
      removeOverlay();

      overlay = document.createElement('div');
      overlay.classList.add('image-resize-overlay');
      
      const parent = editorElement.parentNode;
      parent.style.position = 'relative';
      parent.appendChild(overlay);

      positionOverlay(img);
      createHandles();
    };

    const positionOverlay = (img) => {
      if (!overlay || !img) return;

      const parent = editorElement.parentNode;
      const imgRect = img.getBoundingClientRect();
      const containerRect = parent.getBoundingClientRect();

      Object.assign(overlay.style, {
        left: `${imgRect.left - containerRect.left - 2 + parent.scrollLeft}px`,
        top: `${imgRect.top - containerRect.top - 2 + parent.scrollTop}px`,
        width: `${imgRect.width + 4}px`,
        height: `${imgRect.height + 4}px`,
      });
    };

    const createHandles = () => {
      const positions = [
        { name: 'nw', top: '-6px', left: '-6px', cursor: 'nwse-resize' },
        { name: 'ne', top: '-6px', right: '-6px', cursor: 'nesw-resize' },
        { name: 'sw', bottom: '-6px', left: '-6px', cursor: 'nesw-resize' },
        { name: 'se', bottom: '-6px', right: '-6px', cursor: 'nwse-resize' },
        { name: 'n', top: '-6px', left: '50%', marginLeft: '-6px', cursor: 'ns-resize' },
        { name: 's', bottom: '-6px', left: '50%', marginLeft: '-6px', cursor: 'ns-resize' },
        { name: 'w', top: '50%', left: '-6px', marginTop: '-6px', cursor: 'ew-resize' },
        { name: 'e', top: '50%', right: '-6px', marginTop: '-6px', cursor: 'ew-resize' },
      ];

      positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.classList.add('image-resize-handle', pos.cursor);
        Object.assign(handle.style, pos);
        
        handle.addEventListener('mousedown', (e) => handleMouseDown(e, pos.name));
        
        overlay.appendChild(handle);
        handles.push(handle);
      });
    };

    const removeOverlay = () => {
      if (overlay) {
        handles.forEach(h => h.remove());
        handles = [];
        overlay.remove();
        overlay = null;
      }
    };

    const handleImageClick = (e) => {
      if (e.target.tagName === 'IMG') {
        if (selectedImage === e.target) return;
        selectedImage = e.target;
        createOverlay(selectedImage);
      } else {
        selectedImage = null;
        removeOverlay();
      }
    };

    const handleMouseDown = (e, position) => {
      e.preventDefault();
      e.stopPropagation();

      if (!selectedImage) return;

      isResizing = true;
      resizePosition = position;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = selectedImage.offsetWidth;
      startHeight = selectedImage.offsetHeight;
      aspectRatio = startWidth / startHeight;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isResizing || !selectedImage) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      // 각 핸들 위치에 따른 리사이징
      if (resizePosition.includes('e')) newWidth = startWidth + deltaX;
      if (resizePosition.includes('w')) newWidth = startWidth - deltaX;
      if (resizePosition.includes('s')) newHeight = startHeight + deltaY;
      if (resizePosition.includes('n')) newHeight = startHeight - deltaY;

      // 비율 유지 (모서리 핸들의 경우)
      if (resizePosition.length === 2) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio;
        } else {
          newWidth = newHeight * aspectRatio;
        }
      }

      // 최소 크기 제한
      if (newWidth < 50) newWidth = 50;
      if (newHeight < 50) newHeight = 50;

      selectedImage.style.width = `${newWidth}px`;
      selectedImage.style.height = 'auto';
      
      positionOverlay(selectedImage);
    };

    const handleMouseUp = async () => {
      if (!isResizing || !selectedImage) return;

      isResizing = false;

      const finalWidth = selectedImage.offsetWidth;
      const finalHeight = selectedImage.offsetHeight;

      // 리사이즈 후 재업로드
      if (finalWidth !== selectedImage.naturalWidth) {
        reuploadResizedImage(selectedImage, finalWidth, finalHeight);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    editorElement.addEventListener('click', handleImageClick);

    return () => {
      editorElement.removeEventListener('click', handleImageClick);
      removeOverlay();
      const existingStyle = document.getElementById('quill-image-resize-style');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [isReady, reuploadResizedImage]);


  
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ size: ['16px', '18px', '20px', '24px', '32px'] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  );

  const formats = useMemo(
    () => [
      'bold',
      'italic',
      'underline',
      'size',
      'strike',
      'list',
      'color',
      'background',
      'align',
      'link',
      'image',
    ],
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLoading) {
      CustomAlert({
        text: "이미지 업로드중입니다. 잠시후에 다시 시도해주세요."
      })
      return false;
    };
    if(!(title.trim())){
      CustomAlert({
        text: "제목 입력 후 등록해주세요."
      })
      return false;
    }
    if(!(content.trim())){
      CustomAlert({
        text: "내용 입력 후 등록해주세요."
      })
      return false;
    }
    console.log('제목:', title);
    console.log('내용:', content);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', content);

    await updateMutate.mutateAsync({
      brdId: params.boardId,
      formData: formData
    });

    navigate(adminPage?`/admin/board/${params.boardId}`:`/board/${params.boardId}`);
  };

  const cancleWrite = async () => {
    await deleteMutate.mutateAsync(params.boardId);
    toggleRefresh(); // 리스트 다시 불러오게 설정
  }

  const goBoard = () => {
    cancleWrite();
    if (type === "update") {
      if (adminPage) navigate(`/admin/board/${params.boardId}`);
      else navigate(`/board/${params.boardId}`);
    } else {
      if(adminPage) navigate("/admin/board");
      else navigate("/board");
    }
  }

  // // 내용 입력 시 업로드한 이미지를 배열에 저장
  // useEffect(() => {
  //   if(isLoading) return;

  //   console.log('내용 변경!')
  //   const currentImgList = content.match(/<img [^>]*>/g);
  //   if(!currentImgList || currentImgList?.length == 0) return;
    
  //   setImgFile(prev => {
  //     const deletedImgTag = prev.find((imgTag) => !currentImgList.includes(imgTag));
  //     if(deletedImgTag) {
  //         const deletedImgName = deletedImgTag.match(/data-file-name="([^"]+)"/);
  //         console.log(deletedImgTag)
  //       }
      
  //       return [...currentImgList]
  //     });
  // }, [content, setContent])

  // useEffect(() => {

  // }, [imgFile])

  // 게시물 내용 가져오기
  useEffect(() => {
    const fetchBoard = async () => {
      const result = await getMutate.mutateAsync(params.boardId);
      setBoardDetail(result.board);
      setTitle(result.board.title);
      setContent(result.board.contents);
      console.log(result.board);
    }
    fetchBoard();
  }, [])

  return (
    <>
      {USE_MOCK && (
        <div style={{ 
          background: '#fff3cd', 
          padding: '10px', 
          marginBottom: '10px', 
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          이미지 삽입 시 클릭 후 핸들을 드래그하여 크기 조정이 가능합니다 🙂
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.board_title_bg}>
          <input
            type='text'
            className={styles['board_title_txt']}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='제목을 입력하세요'
            name="title"
            id="title"
            />
        </div>
        <section className={styles.content_bg}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder='내용을 입력하세요...'
            style={{ height: '500px', marginBottom: '50px' }}
            />
          <div className='short_btn_bg'>
            <button type='submit' className='min_btn_b'>
              {type === "update" ? "수정" : "등록"}
            </button>
            <button type="button" className='min_btn_w' onClick={goBoard}>취소</button>
          </div>
        </section>
      </form>
    </>
  );
}

export default BoardForm;