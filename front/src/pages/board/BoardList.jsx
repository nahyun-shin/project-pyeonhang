import React, { useCallback, useEffect, useMemo, useState } from "react";
import { boardStore } from "../../store/boardStore";
import { useLocation, useNavigate } from "react-router";
import styles from '@/pages/board/boardList.module.css';
import SearchInput from "../../components/SearchInput";
import Pagination from "@/components/pagination/Pagination";
import { authStore } from "../../store/authStore";
import Table from "../../components/table/Table";
import { useBoard } from "../../hooks/useBoard";
import { useAdmin } from "../../hooks/useAdmin";
import CustomAlert from "../../components/alert/CustomAlert";
import Loading from "../../components/Loading";

const colWidth = ['50px', '', '160px', '80px', '130px'];
const headers = ['NO', '제목', '글쓴이', '추천 수', '작성 일'];

function BoardList() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const refresh = boardStore((state) => state.refresh);
    const { userRole, isAuthenticated } = authStore();
    
    const adminPage = location.pathname.split('/').slice(0, 3).join('/') === '/admin/board';
    
    // URL에서 초기값 읽기 (useMemo로 최적화)
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
    
    // URL 파라미터로부터 직접 초기 상태 설정
    const [currentPage, setCurrentPage] = useState(() => parseInt(queryParams.get("page") ?? "0", 10));
    const [sortType, setSortType] = useState(() => queryParams.get("sort") || "create");
    const [searchType, setSearchType] = useState(() => queryParams.get("searchType") || "title");
    const [searchQuery, setSearchQuery] = useState(() => queryParams.get("q") || "");
    const [chkOn, setChkOn] = useState([]);
    
    const { createMutate, useBoardList } = useBoard();
    const { deleteBoardMutate, bestBoardMutate, noticeBoardMutate } = useAdmin();

    // 게시글 리스트 가져오기
    const { data, isLoading, isError, refetch } = useBoardList({
        sortType,
        searchType,
        keyword: searchQuery,
        page: currentPage,
        size: 10
    });

    // columns 계산 (useMemo로 최적화)
    const columns = useMemo(() => {
        if (!data?.items || data.items.length === 0) return [];
        return data.items.map((list) => {
            const { brdId, title, userId, likeCount, createDate } = list;
            return { brdId, title, userId, likeCount, createDate };
        });
    }, [data?.items]);

    // URL 업데이트
    const updateUrl = useCallback((params) => {
        const newQueryParams = new URLSearchParams(location.search);
        
        Object.entries(params).forEach(([key, value]) => {
            if (value != null && value !== '') {
                newQueryParams.set(key, value);
            } else {
                newQueryParams.delete(key);
            }
        });
        
        navigate(`${location.pathname}?${newQueryParams.toString()}`, { replace: true });
    }, [location.pathname, location.search, navigate]);

    // 필터 변경
    const handleFilterChange = useCallback((type, value) => {
        if (type === "sort") {
            setSortType(value);
            setCurrentPage(0);
            updateUrl({ page: 0, sort: value, searchType, q: searchQuery });
        } else if (type === "searchType") {
            setSearchType(value);
            setCurrentPage(0);
            updateUrl({ page: 0, sort: sortType, searchType: value, q: searchQuery });
        }
    }, [sortType, searchType, searchQuery, updateUrl]);

    // 검색
    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setCurrentPage(0);
        updateUrl({ page: 0, sort: sortType, searchType, q: query });
    }, [sortType, searchType, updateUrl]);

    // 체크 확인
    const isChecked = useCallback(() => {
        if (chkOn.length <= 0) {
            CustomAlert({
                text: '게시물을 선택해주세요'
            });
            return false;
        }
        return true;
    }, [chkOn.length]);

    // 채택
    const selectBrd = useCallback(async () => {
        if (!isChecked()) return;
        await bestBoardMutate.mutateAsync(chkOn);
        setChkOn([]);
        refetch();
    }, [isChecked, bestBoardMutate, chkOn, refetch]);

    // 공지 등록
    const noticeBrd = useCallback(async () => {
        if (!isChecked()) return;
        await noticeBoardMutate.mutateAsync(chkOn);
        setChkOn([]);
        refetch();
    }, [isChecked, noticeBoardMutate, chkOn, refetch]);

    // 삭제
    const delBrd = useCallback(async () => {
        if (!isChecked()) return;
        await deleteBoardMutate.mutateAsync(chkOn);
        setChkOn([]);
        refetch();
    }, [isChecked, deleteBoardMutate, chkOn, refetch]);

    // 게시글 등록
    const writeHandler = useCallback(async () => {
        if (!isAuthenticated()) {
            CustomAlert({
                text: "로그인 후 이용해주세요."
            });
            return navigate('/login');
        }
        const boardId = await createMutate.mutateAsync();
        navigate(adminPage ? `/admin/board/${boardId}/write` : `/board/${boardId}/write`);
    }, [isAuthenticated, createMutate, navigate, adminPage]);

    // 페이지 이동
    const movePage = useCallback((newPage) => {
        setCurrentPage(newPage);
        updateUrl({ page: newPage, sort: sortType, searchType, q: searchQuery });
    }, [sortType, searchType, searchQuery, updateUrl]);

    // URL 파라미터 변경 감지 (뒤로가기/앞으로가기 대응)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlPage = parseInt(params.get("page") ?? "0", 10);
        const urlSort = params.get("sort") || "create";
        const urlSearchType = params.get("searchType") || "title";
        const urlQuery = params.get("q") || "";

        // 상태와 URL이 다를 때만 업데이트
        if (urlPage !== currentPage) setCurrentPage(urlPage);
        if (urlSort !== sortType) setSortType(urlSort);
        if (urlSearchType !== searchType) setSearchType(urlSearchType);
        if (urlQuery !== searchQuery) setSearchQuery(urlQuery);
    }, [location.search]);

    // refresh 변경 시 refetch
    useEffect(() => {
        refetch();
    }, [refresh, refetch]);

    return (
        <>
            <div className='base_search_bg'>
                <select 
                    name="" 
                    id="" 
                    className="form-select" 
                    value={searchType} 
                    onChange={(e) => handleFilterChange('searchType', e.target.value)}
                >
                    <option value="title">제목</option>
                    <option value="titlecontents">제목+내용</option>
                    <option value="writer">작성자</option>
                </select>
                <SearchInput value={searchQuery} onChange={handleSearch} />
            </div>
            
            <div className={styles.brd_info_wrap}>
                <div className={styles.brd_list_info}>
                    <div className="total">
                        총 <strong>{data?.totalElements ?? 0}</strong> 개
                    </div>
                    <select 
                        name="" 
                        id="" 
                        className="form-select" 
                        value={sortType} 
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                        <option value="create">등록순</option>
                        <option value="like">추천순</option>
                    </select>
                </div>
                {adminPage && (
                    <>
                        <button className="min_btn_w" onClick={noticeBrd}>공지</button>
                        <button className="min_btn_w" onClick={selectBrd}>채택</button>
                        <button className="min_btn_w" onClick={delBrd}>삭제</button>
                    </>
                )}
            </div>

            <section className={styles.board_list}>
                {isLoading ? (
                    <Loading />
                ) : isError ? (
                    <div>데이터를 불러오는데 실패했습니다.</div>
                ) : (
                    <Table 
                        colWidth={colWidth}
                        headers={headers}
                        setCheckedList={setChkOn}
                        checkedList={chkOn}
                        columns={columns}
                        data={data?.items ?? []}
                        path={adminPage ? "/admin/board" : "/board"}
                    />
                )}
            </section>

            <div className="r_btn">
                <button onClick={writeHandler} className="min_btn_b">글쓰기</button>
            </div>

            <section>
                <Pagination 
                    page={currentPage} 
                    totalRows={data?.totalElements ?? 0} 
                    pagePerRows={10} 
                    movePage={movePage} 
                />
            </section>
        </>
    );
}

export default BoardList;