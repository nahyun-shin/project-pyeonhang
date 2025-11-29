import React, { useEffect, useState } from 'react';
import styles from '@/components/comment/comment.module.css';
import { formatDate } from '../../hooks/utils';
import { authStore } from '../../store/authStore';

function CommentItem({comment,isEditing,onStartEdit,onCancelEdit,onSubmitEdit,onDelete}) {
    const {userId}= authStore();
    const [localText, setLocalText] = useState(comment.contents);

    useEffect(()=>{
        console.log(comment);
    },[comment])

    // 수정 모드 들어갈 때 원래 내용으로 초기화
    useEffect(() => {
        if (isEditing) {
            setLocalText(comment.content);
        }
    }, [isEditing, comment.content]);

    return (
        <li className={styles.comment_item}>
            <div className={styles.comment_head}>
                <p className={styles.name}>{comment.nickname ?? comment.userId}</p>
                <div className={styles.info}>
                    <span className={styles.date}>{comment.updatedDate?`수정됨 ${formatDate(comment.updatedDate)} `:formatDate(comment.createdDate)}</span>
                    {comment.userId === userId && (
                        !isEditing ? (
                            <div className={styles.btn_box}>
                            <button type="button" onClick={onStartEdit}>수정</button> |
                            <button type="button" onClick={onDelete}>삭제</button>
                            </div>
                        ) : (
                            <div className={styles.btn_box}>
                            <button
                                type="button"
                                onClick={() => onSubmitEdit(comment.commentId, localText)}
                            >
                                완료
                            </button>
                            |
                            <button type="button" onClick={onCancelEdit}>취소</button>
                            </div>
                        )
                    )}
                </div>
            </div>
            {isEditing?
                (
                    <textarea 
                        className={styles.updateText} 
                        value={localText} 
                        onChange={(e)=>setLocalText(e.target.value)}>
                    </textarea>
                ):(
                    <p className={styles.text}>
                        {comment.content}
                    </p>
                )
            }
        </li> 
    );
}

export default CommentItem;