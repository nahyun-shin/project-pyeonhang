 import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import likeOn from '../../assets/img/likeOn.png';
import likeOff from '../../assets/img/likeOff.png';
import CommentLayout from '../../components/comment/CommentLayout';
import 'react-quill-new/dist/quill.snow.css';
import styles from '@/pages/board/boardList.module.css';
import { useBoard } from '../../hooks/useBoard';
import { formatDate } from '../../utils/dateFormat';
import { authStore } from '../../store/authStore';
import CustomAlert from '../../components/alert/CustomAlert';

function BoardDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const {userRole,isAuthenticated,userId}=authStore();

    const isAdmin = userRole === 'ROLE_ADMIN';

    const adminPage = location.pathname.split('/').slice(0, 3).join('/') === '/admin/board';

    const [isActive, setIsActive] = useState(false);
    const [boardDetail, setBoardDetail] = useState({});
    const { 
        getMutate, 
        deleteMutate,
        bestMutate,
        createCommentMutate, 
        listCommentMutate, 
        updateCommentMutate,
        deleteCommentMutate
     } = useBoard();
    
    const [comments, setComments]=useState([]);

    const fetchBoard = async () => {
      const result = await getMutate.mutateAsync(params.boardId);
      setBoardDetail(result.board);
    }

    const deleteBoard = async () => {
        const isConfirm = await CustomAlert({
            title: "게시글 삭제",
            width:"500px",
            showCancelButton:true,
            text:"게시물을 삭제하시겠습니까?"
        });
        if(!isConfirm) return;
        await deleteMutate.mutateAsync(params.boardId);
        navigate(adminPage? `/admin/board`:`/board`);
    }

    const bestBoard = async () => {
        await bestMutate.mutateAsync(params.boardId);
        fetchBoard();
    }

    const fetchComment = async() => {
        const result = await listCommentMutate.mutateAsync(params.boardId);
        setComments(result.items);

    }
    const addComment= async(content)=>{
        if(!isAuthenticated()) return CustomAlert({text: '로그인 후 댓글을 이용해주세요.'});
        const formData = new FormData();
        formData.append("contents", content)
        await createCommentMutate.mutateAsync({brdId:params.boardId, formData});
        fetchComment();
    }
    const updateComment = async (commentId, content)=>{
        const formData = new FormData();
        formData.append("contents", content)
        await updateCommentMutate.mutateAsync({commentId, formData});
        fetchComment();
    }
    const deleteComment = async(commentId)=>{
        if(!confirm("댓글을 삭제하시겠습니까?")) return false;
        await deleteCommentMutate.mutateAsync(commentId);
        fetchComment();
    }



  useEffect(() => {
    fetchBoard();
    fetchComment();
  }, [])

  useEffect(() => {
    const active = boardDetail?.isLiked;
    setIsActive(active);
  }, [boardDetail])



  console.log(boardDetail);

    return (
        <>
            <div className={styles.board_title_bg}>
                <p className={styles.board_title_txt}>{boardDetail.title}</p>
                <p>{boardDetail.userId} · {formatDate(boardDetail.createDate, true)} · 추천수 {boardDetail.likeCount}</p>
            </div>
            <section className={styles.content_bg}>
                <div 
                    className={`${styles.content_txt} ql-editor`}
                    dangerouslySetInnerHTML={{ __html: boardDetail.contents }}
                />
                <div className='short_btn_bg'>
                    <button 
                        type='button'
                        onClick={bestBoard}
                        className={`min_btn_b ${styles.like_btn}`}
                    >
                        <span>추천</span>
                        <img src={isActive ? likeOn : likeOff} alt="좋아요 아이콘" />
                    </button>
                    {(isAdmin || userId === boardDetail.userId) &&
                        <>
                            <Link to={adminPage ? `/admin/board/${params.boardId}/update`:`/board/${params.boardId}/update`} className='min_btn_b'>수정</Link>
                            <button type="button" className='min_btn line red' onClick={deleteBoard}>삭제</button>
                        </> 
                    }
                    <Link to="/board" className='min_btn_w'>목록</Link>
                </div>
            </section>
            <CommentLayout
                comments={comments}
                add={addComment}
                del={deleteComment}
                update={updateComment}
            />
        </>
    );
}

export default BoardDetail;