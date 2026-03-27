export class LogManager {
    constructor() {
        this.logs = [];
        this.maxLogs = 100; // Maximum number of logs to store
        this.logTypes = {
            BALDI_REACTION: 'baldi-reaction',
            DETENTION: 'detention',
            FILE_SELECTION: 'file-selection',
            PRINCIPAL_MESSAGE: 'principal-message',
            SCREEN_SHARE: 'screen-share'
        };
        
        this.createLogButton();
        this.createLogPopup();
    }

    addLog(type, message, details = {}) {
        const timestamp = new Date().toLocaleTimeString();
        const log = { 
            type, 
            message, 
            timestamp, 
            details 
        };
        
        this.logs.unshift(log); // Add to start of array for reverse chronological order
        
        // Trim logs if they exceed the maximum
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        
        // Update the log popup if it's open
        if (this.popup && this.popup.style.display === 'block') {
            this.updateLogContent();
        }
    }

    createLogButton() {
        const button = document.createElement('button');
        button.textContent = 'Log ';
        button.className = 'log-button';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.padding = '8px 15px';
        button.style.backgroundColor = '#4CAF50'; // Green color
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.display = 'flex';
        button.style.justifyContent = 'center';
        button.style.alignItems = 'center';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.style.zIndex = '1000';
        
        button.addEventListener('click', () => this.toggleLogPopup());
        
        document.body.appendChild(button);
        this.logButton = button;
    }

    createLogPopup() {
        const popup = document.createElement('div');
        popup.className = 'log-popup';
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '80%';
        popup.style.maxWidth = '800px';
        popup.style.height = '70%';
        popup.style.backgroundColor = 'white';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        popup.style.display = 'none';
        popup.style.flexDirection = 'column';
        popup.style.zIndex = '2000';
        popup.style.overflow = 'hidden';
        
        // Create header
        const header = document.createElement('div');
        header.style.padding = '15px';
        header.style.borderBottom = '1px solid #eee';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.backgroundColor = '#e8f5e9'; // Light green background
        
        const title = document.createElement('h2');
        title.textContent = "Baldi's Activity Log";
        title.style.margin = '0';
        title.style.fontFamily = "'Comic Sans MS', cursive";
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '24px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = '#333';
        closeButton.addEventListener('click', () => this.toggleLogPopup());
        
        header.appendChild(title);
        header.appendChild(closeButton);
        
        // Create filters
        const filterBar = document.createElement('div');
        filterBar.style.padding = '10px 15px';
        filterBar.style.borderBottom = '1px solid #eee';
        filterBar.style.display = 'flex';
        filterBar.style.flexWrap = 'wrap';
        filterBar.style.gap = '10px';
        
        const filterTypes = [
            { id: 'all', label: 'All' },
            { id: this.logTypes.BALDI_REACTION, label: 'Baldi Reactions' },
            { id: this.logTypes.DETENTION, label: 'Detentions' },
            { id: this.logTypes.FILE_SELECTION, label: 'File Selections' },
            { id: this.logTypes.PRINCIPAL_MESSAGE, label: 'Principal Messages' },
            { id: this.logTypes.SCREEN_SHARE, label: 'Screen Share' }
        ];
        
        filterTypes.forEach(filter => {
            const button = document.createElement('button');
            button.textContent = filter.label;
            button.dataset.filterType = filter.id;
            button.className = 'log-filter-button';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = filter.id === 'all' ? '#4CAF50' : '#f0f0f0';
            button.style.color = filter.id === 'all' ? 'white' : '#333';
            button.style.border = 'none';
            button.style.borderRadius = '4px';
            button.style.cursor = 'pointer';
            
            button.addEventListener('click', (e) => {
                // Update active filter
                document.querySelectorAll('.log-filter-button').forEach(btn => {
                    btn.style.backgroundColor = '#f0f0f0';
                    btn.style.color = '#333';
                });
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                
                // Filter log entries
                this.filterLogs(filter.id);
            });
            
            filterBar.appendChild(button);
        });
        
        // Create log content area
        const logContent = document.createElement('div');
        logContent.className = 'log-content';
        logContent.style.flex = '1';
        logContent.style.overflowY = 'auto';
        logContent.style.padding = '15px';
        
        // Create export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Logs ';
        exportButton.style.margin = '10px 15px';
        exportButton.style.padding = '8px 15px';
        exportButton.style.backgroundColor = '#4CAF50';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.borderRadius = '4px';
        exportButton.style.cursor = 'pointer';
        exportButton.style.alignSelf = 'flex-end';
        
        exportButton.addEventListener('click', () => this.exportLogs());
        
        // Assemble the popup
        popup.appendChild(header);
        popup.appendChild(filterBar);
        popup.appendChild(logContent);
        popup.appendChild(exportButton);
        
        document.body.appendChild(popup);
        this.popup = popup;
        this.logContent = logContent;
    }

    toggleLogPopup() {
        if (this.popup.style.display === 'none' || !this.popup.style.display) {
            this.popup.style.display = 'flex';
            this.updateLogContent();
            // Change button text when log is open
            this.logButton.textContent = 'Close Log ';
        } else {
            this.popup.style.display = 'none';
            // Change button text back when log is closed
            this.logButton.textContent = 'Log ';
        }
    }

    updateLogContent(filterType = 'all') {
        // Clear current content
        this.logContent.innerHTML = '';
        
        if (this.logs.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'No logs recorded yet. Interact with Baldi to start logging!';
            emptyMessage.style.padding = '20px';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#999';
            this.logContent.appendChild(emptyMessage);
            return;
        }
        
        // Filter logs if needed
        const filteredLogs = filterType === 'all' 
            ? this.logs 
            : this.logs.filter(log => log.type === filterType);
        
        // Create log entries
        filteredLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-type-${log.type}`;
            logEntry.style.padding = '10px';
            logEntry.style.marginBottom = '10px';
            logEntry.style.borderRadius = '4px';
            logEntry.style.borderLeft = '4px solid';
            
            // Color-code by type
            switch(log.type) {
                case this.logTypes.BALDI_REACTION:
                    logEntry.style.borderLeftColor = '#4CAF50'; // Green
                    logEntry.style.backgroundColor = '#f0f9e8';
                    break;
                case this.logTypes.DETENTION:
                    logEntry.style.borderLeftColor = '#f44336'; // Red
                    logEntry.style.backgroundColor = '#ffebee';
                    break;
                case this.logTypes.FILE_SELECTION:
                    logEntry.style.borderLeftColor = '#2196F3'; // Blue
                    logEntry.style.backgroundColor = '#e3f2fd';
                    break;
                case this.logTypes.PRINCIPAL_MESSAGE:
                    logEntry.style.borderLeftColor = '#FF9800'; // Orange
                    logEntry.style.backgroundColor = '#fff3e0';
                    break;
                case this.logTypes.SCREEN_SHARE:
                    logEntry.style.borderLeftColor = '#9C27B0'; // Purple
                    logEntry.style.backgroundColor = '#f3e5f5';
                    break;
                default:
                    logEntry.style.borderLeftColor = '#9e9e9e'; // Grey
                    logEntry.style.backgroundColor = '#f5f5f5';
            }
            
            // Create header with timestamp and type indicator
            const logHeader = document.createElement('div');
            logHeader.style.display = 'flex';
            logHeader.style.justifyContent = 'space-between';
            logHeader.style.marginBottom = '5px';
            logHeader.style.fontWeight = 'bold';
            
            const logType = document.createElement('span');
            switch(log.type) {
                case this.logTypes.BALDI_REACTION:
                    logType.textContent = ' Baldi';
                    break;
                case this.logTypes.DETENTION:
                    logType.textContent = ' Detention';
                    break;
                case this.logTypes.FILE_SELECTION:
                    logType.textContent = ' File';
                    break;
                case this.logTypes.PRINCIPAL_MESSAGE:
                    logType.textContent = ' Principal';
                    break;
                case this.logTypes.SCREEN_SHARE:
                    logType.textContent = ' Screen Share';
                    break;
                default:
                    logType.textContent = ' System';
            }
            
            const timestamp = document.createElement('span');
            timestamp.textContent = log.timestamp;
            timestamp.style.color = '#666';
            timestamp.style.fontSize = '0.9em';
            
            logHeader.appendChild(logType);
            logHeader.appendChild(timestamp);
            
            // Create message content
            const logMessage = document.createElement('div');
            logMessage.innerHTML = log.message;
            logMessage.style.marginBottom = '5px';
            
            // Add any details if available
            let logDetails = null;
            if (log.details && Object.keys(log.details).length > 0) {
                logDetails = document.createElement('div');
                logDetails.style.fontSize = '0.9em';
                logDetails.style.color = '#666';
                
                for (const [key, value] of Object.entries(log.details)) {
                    const detailItem = document.createElement('div');
                    detailItem.textContent = `${key}: ${value}`;
                    logDetails.appendChild(detailItem);
                }
            }
            
            // Assemble log entry
            logEntry.appendChild(logHeader);
            logEntry.appendChild(logMessage);
            if (logDetails) logEntry.appendChild(logDetails);
            
            this.logContent.appendChild(logEntry);
        });
    }

    filterLogs(filterType) {
        this.updateLogContent(filterType);
    }

    exportLogs() {
        try {
            // Create formatted log text
            let logText = "BALDI'S ACTIVITY LOG\n";
            logText += "===================\n\n";
            
            this.logs.forEach(log => {
                logText += `[${log.timestamp}] `;
                
                switch(log.type) {
                    case this.logTypes.BALDI_REACTION:
                        logText += "[BALDI] ";
                        break;
                    case this.logTypes.DETENTION:
                        logText += "[DETENTION] ";
                        break;
                    case this.logTypes.FILE_SELECTION:
                        logText += "[FILE] ";
                        break;
                    case this.logTypes.PRINCIPAL_MESSAGE:
                        logText += "[PRINCIPAL] ";
                        break;
                    case this.logTypes.SCREEN_SHARE:
                        logText += "[SCREEN SHARE] ";
                        break;
                    default:
                        logText += "[SYSTEM] ";
                }
                
                // Strip HTML tags for plain text export
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = log.message;
                logText += tempDiv.textContent + "\n";
                
                // Add details if available
                if (log.details && Object.keys(log.details).length > 0) {
                    for (const [key, value] of Object.entries(log.details)) {
                        logText += `  • ${key}: ${value}\n`;
                    }
                }
                
                logText += "\n";
            });
            
            // Create a blob and download link
            const blob = new Blob([logText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Format date for filename
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0];
            const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-');
            
            a.download = `baldi-logs-${dateStr}-${timeStr}.txt`;
            a.click();
            
            // Clean up
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting logs:', error);
            alert('There was an error exporting the logs. Please try again.');
        }
    }
}