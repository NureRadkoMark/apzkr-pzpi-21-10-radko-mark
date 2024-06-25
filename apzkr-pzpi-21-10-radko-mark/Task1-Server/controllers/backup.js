const fs = require('fs-extra');
const { exec } = require('child_process');
const archiver = require('archiver');
const path = require('path');

class Backup {
    constructor() {
        this.BACKUP_DIR = path.join(__dirname, 'Backup');
        this.DB_BACKUP_PATH = path.join(this.BACKUP_DIR, 'db');
        this.FILE_SYSTEM_BACKUP_PATH = path.join(this.BACKUP_DIR, 'filesystem');
        this.ARCHIVE_PATH = path.join(this.BACKUP_DIR, 'backup.zip'); // Изменен путь для архива
        this.DB_NAME = process.env.DB_NAME;
        this.DB_USER = process.env.DB_USER;
        this.DB_PASSWORD = process.env.DB_PASSWORD;

        try {
            fs.ensureDirSync(this.DB_BACKUP_PATH);
            fs.ensureDirSync(this.FILE_SYSTEM_BACKUP_PATH);
        } catch (err) {
            console.error('Error creating directories:', err);
        }
    }

    backupDatabase(callback) {
        const backupFile = path.join(this.DB_BACKUP_PATH, `backup_${new Date().toISOString().replace(/:/g, '-')}.sql`);
        const command = `"C:\\Program Files\\PostgreSQL\\9.4\\bin\\pg_dump" -U ${this.DB_USER} -d ${this.DB_NAME}`;
        fs.ensureDirSync(this.DB_BACKUP_PATH);

        const childProcess = exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing pg_dump: ${error}`);
                console.error(stderr);
                return callback(error);
            }

            fs.writeFile(backupFile, stdout, (err) => {
                if (err) {
                    console.error(`Error writing backup file: ${err}`);
                    return callback(err);
                }
                console.log(`Database backup created: ${backupFile}`);
                callback(null, backupFile);
            });
        });

        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
    }

    backupFileSystem(databaseBackupPath, callback) {
        const tempBackupDir = path.join(this.BACKUP_DIR, 'temp');
        const srcDir = path.join(__dirname, '..');
        const destFile = this.ARCHIVE_PATH;

        fs.ensureDirSync(tempBackupDir);

        const output = fs.createWriteStream(destFile);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`File system backup created: ${destFile}`);
            callback(null, destFile);
        });

        archive.on('error', (err) => {
            console.error(`Error archiving files: ${err}`);
            callback(err);
        });

        archive.pipe(output);

        const databaseBackupName = path.basename(databaseBackupPath);
        archive.file(databaseBackupPath, { name: databaseBackupName });

        archive.directory(srcDir, false);
        archive.finalize();
    }

    performBackup(req, res) {
        this.backupDatabase((err, dbBackupPath) => {
            if (err) {
                console.error('Error creating database backup:', err);
                return res.status(500).send('Error creating database backup');
            }

            this.backupFileSystem(dbBackupPath, (err, fsBackupPath) => {
                if (err) {
                    console.error('Error creating file system backup:', err);
                    return res.status(500).send('Error creating file system backup');
                }

                return res.status(200).json({ message: 'Successful backup', downloadUrl: 'http://localhost:5000/backup/download' });
            });
        });
    }

    downloadBackup(req, res) {
        const filePath = this.ARCHIVE_PATH;
        if (fs.existsSync(filePath)) {
            res.download(filePath, 'backup.zip', (err) => {
                if (err) {
                    console.error('Error downloading backup:', err);
                    res.status(500).send('Error downloading backup');
                }
            });
        } else {
            res.status(404).send('Backup file not found');
        }
    }
}

module.exports = new Backup();





