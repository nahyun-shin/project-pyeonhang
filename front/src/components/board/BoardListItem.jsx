import React from 'react';
import { Link } from 'react-router';
import styles from '../table/Table.module.css';

function BoardListItem({boardItem,selectedId,handleCheck,isAdmin,checked}) {
    
    console.log(selectedId);
    return (
        <tr>
            <td>
                {isAdmin &&(
                    <input 
                        type="checkbox" 
                        id={boardItem.id}
                        onChange={handleCheck}
                        checked={checked}
                    />
                )}
            </td>
            <td>{boardItem.id}</td>
            <td>
                <Link to="/board/detail"
                    className='' 
                >
                    {boardItem.title}

                    {selectedId &&(
                    <span className={styles.selectBrd}>채택</span>
                    )}
                </Link>
            </td>
            <td>{boardItem.name}</td>
            <td>{boardItem.likeCount}</td>
            <td>{boardItem.date}</td>
        </tr>
    );
}

export default BoardListItem;