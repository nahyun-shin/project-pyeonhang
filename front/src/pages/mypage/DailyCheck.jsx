import React, { useEffect, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import styles from "@/pages/mypage/mypage.module.css";
import Calendar from 'react-calendar';
import arrowLeft from "../../assets/img/calendar_arr_l.png"
import arrowRight from "../../assets/img/calendar_arr_r.png"
import { useMypage } from '../../hooks/useMypage';
import { loadingStore } from '../../store/loadingStore';
import Loading from '../../components/Loading';


function DailyCheck() {
    const [value, onChange] = useState(new Date());

    const { dailyCheckListMutation } = useMypage();
    const [checkedDate, sestCheckedDate] = useState(null);

    const isLoading = loadingStore(state => state.loading); // 요청에 대한 로딩 상태

    const getDateOnly = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const fetchCheckList = async () => {
            const result = await dailyCheckListMutation.mutateAsync();
            sestCheckedDate(result.dates);
            console.log(result.dates)
        }
        fetchCheckList();
    }, [])
    return (
        <>
            <div className={styles.daliy_cont}>
                <h3>출석 체크 현황</h3>

                <div className={styles.calendar_cont}>
                    <Calendar 
                    onChange={onChange} 
                    value={value} 
                    className={styles.calendar}
                    prev2Label={null}
                    next2Label={null}
                    prevLabel={<img src={arrowLeft} />}
                    nextLabel={<img src={arrowRight} />}
                    tileClassName={({date}) => {
                        const dateStr = getDateOnly(date); 
                        
                        // 특정 날짜에 클래스 추가
                        if (checkedDate?.includes(dateStr)) {
                            return 'checked'
                        }
                    }}
                    />
                </div>
            </div>
            {isLoading &&
                <Loading />
            }
        </>
    );
}

export default DailyCheck;