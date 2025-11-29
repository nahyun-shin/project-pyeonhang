import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import SearchInput from '../../../components/SearchInput';
import ShowModal from '../../../components/modal/ShowModal';
import InputForm from '../../../components/InputForm';
import ListBtnLayout from '../../../components/btn/ListBtnLayout';
import Pagination from '../../../components/pagination/Pagination';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUserApi } from '../../../api/user/adminUserApi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from '@/pages/admin/user/user.module.css';
import { usePoint } from '../../../hooks/usePoint';
import { useUser } from '../../../hooks/useUser';
import { authStore } from '../../../store/authStore';
import CustomAlert from '../../../components/alert/CustomAlert';
import Loading from '../../../components/Loading';
import { loadingStore } from '../../../store/loadingStore';

const schema = yup.object().shape({
    givePoint: yup.number().required("지급 할 포인트를 입력해주세요"),
    pointReason: yup.string().required("포인트 지급 사유를 입력해주세요"),
});

function UserList() {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const {grantPointMutation} = usePoint();
    const {disabledUserMutation} = useUser();

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태
    const setLoading = loadingStore.getState().setLoading;

    // 상태
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    //필터 및 검색
    const [roleFilterQuery, setRoleFilterQuery] = useState(queryParams.get('roleFilter') ?? '');
    const [delYnQuery, setDelYnQuery] = useState(queryParams.get('delYn') ?? '');
    const searchQuery = queryParams.get('searchText') ?? '';
    //페이징
    const [totalRows, setTotalRows] = useState(0);
    const currentPage = parseInt(queryParams.get('page') ?? '0', 10);

    const { register, handleSubmit, formState: { errors },reset } = useForm({
        resolver: yupResolver(schema)
    });

    // URL 업데이트
    const updateUrl = useCallback((newParams) => {
        const params = new URLSearchParams(location.search);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        navigate(`${location.pathname}?${params.toString()}`);
    }, [navigate]);
    
    //데이터 불러오기
    const { data:user, isLoading:userLoading } = useQuery({
        queryKey: ['user', searchQuery, roleFilterQuery,delYnQuery, currentPage],
        queryFn: () => adminUserApi.list({
            searchText: searchQuery,
            roleFilter: roleFilterQuery || null,
            delYn: delYnQuery || null,
            page: currentPage,
            size: 10
        }),
        keepPreviousData: true
    });

    //리스트 불러올 때 전역 로딩 상태 동기화
    useEffect(()=>{
        setLoading(userLoading);
    },[userLoading,setLoading]);

    //데이터 세팅
    const userList = user?.content ?? [];

    //총 데이터 개수 set(pagination)
    useEffect(() => {
        if (user) {
            setTotalRows(user.total || 0);
        }
    }, [user]);

    // 페이징
    const movePage = (newPage) => updateUrl({ page: newPage });

    // 검색
    const handleSearch = (newQuery) => {
        updateUrl({ searchText: newQuery, page: 0 });
    };

    // role 필터 변경
    const handleRoleChange = (e) => {
        const value = e.target.value;
        setRoleFilterQuery(value);
        updateUrl({ roleFilter: value || null, page: 0 });
    };
    // delYn 필터 변경
    const handleDelYnChange = (e) => {
        const value = e.target.value;
        setDelYnQuery(value);
        updateUrl({ delYn: value || null, page: 0 });
    };

    // 모달
    const goUpdate = (user) => {
        console.log('선택된 사용자 ID:', user);
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    const handlePoint = handleSubmit((formData)=>{
        if(!selectedUser) return;
        
        grantPointMutation.mutate({
            userId: selectedUser.userId,
            amount: formData.givePoint,
            reason: formData.pointReason,
        },{ 
            onSuccess: () => {
            setShowModal(false);
        }});
    })

    //모달 창 열면 input 초기화
    useEffect(() => {
    if (showModal && selectedUser) {
        reset({
        givePoint: '',
        pointReason: '',
        });
    }
    }, [showModal, selectedUser, reset]);

    // 회원 비활성화 버튼
    const deleteBtn = async (userId) => {
        const isConfirm = await CustomAlert({
            title: "회원 비활성화",
            width:"500px",
            showCancelButton:true,
            text:"비활성화시 되돌릴 수 없습니다 진행하시겠습니까?"
        });

        if (!isConfirm) return;
        
        disabledUserMutation.mutate({userId});
        
    };

    return (
        <>
            <div className='base_search_bg'>
                <select className="form-select" value={roleFilterQuery} onChange={handleRoleChange}>
                    <option value="">전체보기</option>
                    <option value="USER">회원</option>
                    <option value="ADMIN">관리자</option>
                </select>

                <select className="form-select" value={delYnQuery} onChange={handleDelYnChange}>
                    <option value="">전체보기</option>
                    <option value="N">활성</option>
                    <option value="Y">탈퇴</option>
                </select>

                <SearchInput onChange={handleSearch} value={searchQuery} />
            </div>
            <div className={`${styles.admin_total}`}>
                <div className='total'>
                    총 <strong>{totalRows}</strong> 명
                </div>
            </div>
            {userList.map((user) => (
                <ListBtnLayout
                    key={user.userId}
                    topBtn={{
                        type: 'button',
                        onClick: () => goUpdate(user),
                        name: '정보 보기',
                    }}
                    bottomBtn={{
                        type: 'button',
                        onClick: ()=>deleteBtn(user.userId),
                        name: '비활성',
                        style: { backgroundColor: user.delYn === 'N' ? '' : '#c9c9c9' },
                        disabled: user.delYn === 'Y'
                    }}
                >
                    <div className={styles.user_info}>
                        <p className={styles.userRole}>{user.userRole}</p>
                        <p className={styles.userId}>
                            {user.userId}
                            {user.delYn === 'Y' && <span className={styles.deleteAcc}>탈퇴</span>}
                        </p>
                        <p className={styles.userName}>{user.userName}</p>
                        <p className={styles.createAt}>{user.createAt}</p>
                    </div>
                </ListBtnLayout>
            ))}
            
            {selectedUser && (
                <ShowModal
                    show={showModal}
                    title='회원정보 수정'
                    handleEvent={handlePoint}
                    handleClose={handleClose}
                    eventBtnName='지급'
                    closeBtnName='닫기'
                    className={styles.user_info_form}
                >
                        
                    <InputForm className={styles.info} label='가입일' readOnly defaultValue={selectedUser?.createDate|| ''} />
                    <InputForm className={styles.info} label='아이디' readOnly defaultValue={selectedUser?.userId|| ''} />
                    <InputForm className={styles.info} label='이름' readOnly defaultValue={selectedUser?.userName|| ''} />
                    <InputForm className={styles.info} label='이메일' readOnly defaultValue={selectedUser?.email|| ''} />
                    <InputForm className={styles.info} label='닉네임' readOnly defaultValue={selectedUser?.nickname|| ''} />
                    <InputForm className={styles.info} label='생년월일' readOnly defaultValue={selectedUser?.birth|| ''} />
                    <InputForm className={styles.info} label='핸드폰 번호' readOnly defaultValue={selectedUser?.phone|| ''} />
                    <InputForm className={styles.info} type='number' label='보유 포인트' readOnly defaultValue={selectedUser?.pointBalance|| ''} />
                    {((selectedUser.delYn === 'N')&&(selectedUser.userRole === 'USER')) &&
                    <>
                        <InputForm className={styles.info} type='number' label='포인트 지급' name='givePoint' register={register} error={errors.givePoint} />
                        <InputForm className={styles.info} type='text' label='포인트 지급 사유' name='pointReason' register={register} error={errors.pointReason} />
                    </>
                    }
                
                </ShowModal>
            )}

            <Pagination page={currentPage} totalRows={totalRows} pagePerRows={10} movePage={movePage} />
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default UserList;
