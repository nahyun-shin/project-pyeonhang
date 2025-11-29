import React from "react";
import { Button, Modal } from "react-bootstrap";
import "@/components/modal/modal.css";


function ShowModal({show, handleClose, handleEvent=false, 
  closeBtnName, eventBtnName, title, className="", children,
}) {
  return (
    <>


      <Modal 
        show={show} 
        onHide={handleClose} 
        centered dialogClassName={className}

      >

        {title && 
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
        }
        <Modal.Body className="">
          {children}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {handleEvent && 
            <Button className='min_btn_b' onClick={()=>{handleEvent()}}>
              {eventBtnName}
            </Button>
          }
          {handleClose &&
          <Button className={!handleEvent?'min_btn_b':'min_btn_w'} onClick={handleClose}>
            {closeBtnName}
          </Button>
          }
        </Modal.Footer>

      </Modal>
    </>
  );
}

export default ShowModal;
