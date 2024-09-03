// components/TimezoneModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment-timezone';

const TimezoneModal = ({ show, handleClose, detectedTimezone, setSelectedTimezone }) => {
  const [localSelectedTimezone, setLocalSelectedTimezone] = useState(detectedTimezone);

  useEffect(() => {
    setLocalSelectedTimezone(detectedTimezone); // Reset if detectedTimezone changes
  }, [detectedTimezone]);

  const handleTimezoneChange = (event) => {
    setLocalSelectedTimezone(event.target.value);
  };

  const handleSave = () => {
    setSelectedTimezone(localSelectedTimezone); // Pass selected timezone to parent component
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Timezone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Timezone</Form.Label>
          <Form.Control as="select" value={localSelectedTimezone} onChange={handleTimezoneChange}>
            {moment.tz.names().map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimezoneModal;
