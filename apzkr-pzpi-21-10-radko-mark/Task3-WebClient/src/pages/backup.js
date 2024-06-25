import React, { useState } from 'react';
import '../styles/BackupPage.css';

const BackupPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);

    const handleBackup = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/backup', {
                method: 'POST',
            });
            const data = await response.json();
            if (response.ok) {
                setDownloadUrl(data.downloadUrl);

            } else {
                alert('Error creating backup');
            }
        } catch (error) {
            alert('Error creating backup');
        }
        setIsLoading(false);
    };

    return (
        <div className="backup-page-container">
            <h1>Backup</h1>
            <button onClick={handleBackup} disabled={isLoading}>
                {isLoading ? 'Creating backup...' : 'Create Backup'}
            </button>
            {downloadUrl && (
                <a href={downloadUrl} download="backup.zip">
                    Download Backup
                </a>
            )}
        </div>
    );
};

export default BackupPage;



