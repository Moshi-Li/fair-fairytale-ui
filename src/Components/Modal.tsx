import React from "react";

import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { closeModal } from "../Slices/ModalSlice";
import { RootStoreI } from "../Store";

import "./Modal.scss";

const customStyles = {
  overlay: {
    zIndex: "1000",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: `50vw`,
  },
};

const EventModal = () => {
  const { open, selectedEventKey } = useSelector(
    (store: RootStoreI) => store.modalReducer
  );
  const { eventMeta } = useSelector((store: RootStoreI) => store.dataReducer);

  const dispatch = useDispatch();
  return (
    <div>
      <Modal isOpen={open} style={customStyles} ariaHideApp={false}>
        {/*
              <div className="modal--container">
          <ReactJson
            src={eventMeta[selectedEventKey] ? eventMeta[selectedEventKey] : {}}
            theme="monokai"
            groupArraysAfterLength={5}
            collapsed={false}
            style={{
              width: "100%",
              textAlign: "left",
              marginBottom: "60px",
            }}
          />
          <button onClick={() => dispatch(closeModal())}>Close</button>
        </div>
      */}
      </Modal>
    </div>
  );
};

export default EventModal;
