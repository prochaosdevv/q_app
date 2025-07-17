import { useState } from 'react';
import api from '../utils/api';

export const useEditDailyReportForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitForm = async (reportId, formValues) => {
    try {
      setLoading(true);
      setError('');
      setSuccess(false);

      const {
        progressReport,
        plant,
        delays,
        weather,
        labour,
        material,
        photos,
      } = formValues;

      const formData = new FormData();

      formData.append('progressReport', progressReport);
      formData.append('plant', plant);
      formData.append('delays', String(delays));
      formData.append('weather', JSON.stringify({ condition: weather }));
      formData.append('labour', JSON.stringify(labour));
      formData.append('material', JSON.stringify(material));

      photos.forEach(photo => {
        // If it's a URI string from local file or remote
        if (typeof photo === 'string') {
          const filename = photo.split('/').pop();
          const match = /\.(\w+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : `image`;

          formData.append('photos', {
            uri: photo,
            name: filename,
            type,
          });
        } else {
          // If already a file object (from picker or pre-uploaded)
          formData.append('photos', photo);
        }
      });

      console.log('FormData Preview', formData, reportId);

      await api.put(`/project/daily-report/update/${reportId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
    } catch (err) {
      console.log('Submit Error:', err);
      setError('Failed to update daily report');
    } finally {
      setLoading(false);
    }
  };

  return {
    submitForm,
    loading,
    error,
    success,
    setSuccess,
  };
};
