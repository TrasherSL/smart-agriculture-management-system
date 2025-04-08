import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config';
import './AdminStyles.css';

const SystemStatus = () => {
  return (
    <div>
      <h1>System Status (Simplified)</h1>
      <p>This is a simplified version of the SystemStatus component that doesn't use FontAwesome.</p>
      <p>For testing FontAwesome, please visit <a href="/fontawesome-test">/fontawesome-test</a></p>
    </div>
  );
};

export default SystemStatus;