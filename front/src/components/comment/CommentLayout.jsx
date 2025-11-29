import React, { useState } from 'react';
import CommentItem from './CommentItem';
import styles from '@/components/comment/comment.module.css';
import BtnForm from '../btn/BtnForm';
import { useQuery } from '@tanstack/react-query';
import { commentApi } from '../../api/comment/commentApi';
import { useComment } from '../../hooks/useComment';
import CustomAlert from '../alert/CustomAlert';

function CommentLayout({ comments,add,update,del}) {
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    
    //댓글등록
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            CustomAlert({
                text:"댓글을 입력해주세요."
            })
        }
        add(text);
        setText('');
    };
    //수정
    const handleStartEdit = (commentId) => {
        setEditingId(commentId);
    };
    const handleCancelEdit = () => {
        setEditingId(null);
    };
    const handleSubmitEdit = (commentId,content)=>{
        update(commentId,content);
        setEditingId(null);
    }
    //삭제
    const handleDelete = (commentId)=>{
        del(commentId);
    }
    return (
        
            <section className={styles.comment}>
                <p>댓글 <b>{comments?.length}</b> 개</p>
                <ul className={styles.comment_list}>
                    {comments?.map((comment) => (
                        <CommentItem
                            key={comment.commentId}
                            comment={comment}
                            isEditing={editingId === comment.commentId}
                            onStartEdit={() => handleStartEdit(comment.commentId)}
                            onSubmitEdit={handleSubmitEdit}
                            onCancelEdit={handleCancelEdit}
                            onDelete={() => handleDelete(comment.commentId)}
                        />
                    ))}
                </ul>
                <form onSubmit={handleSubmit} autoComplete='off'>
                    <div className={styles.comment_box}>
                        <textarea
                            className={styles.form_text}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="댓글을 입력하세요"
                        />
                        <button type='submit'>등록</button>
                        
                    </div>
                </form>
            </section>
        
    );
}

export default CommentLayout;