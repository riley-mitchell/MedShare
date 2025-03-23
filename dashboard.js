// Demo files to work with (as if they were uploaded from GitHub)
const demoFiles = [
    {
        id: 'file1',
        name: 'Blood Test Results.pdf',
        type: 'application/pdf',
        path: 'files/blood_test_results.pdf',
        icon: 'fas fa-file-pdf',
        date: 'March 15, 2025',
        size: '2.4 MB'
    },
    {
        id: 'file2',
        name: 'X-Ray Scan.jpg',
        type: 'image/jpeg',
        path: 'files/xray_scan.jpg',
        icon: 'fas fa-file-image',
        date: 'March 10, 2025',
        size: '3.7 MB'
    },
    {
        id: 'file3',
        name: 'Prescription - Dr. Johnson.pdf',
        type: 'application/pdf',
        path: 'files/prescription_dr_johnson.pdf',
        icon: 'fas fa-file-pdf',
        date: 'March 3, 2025',
        size: '1.2 MB'
    },
    {
        id: 'file4',
        name: 'MRI Results.jpg',
        type: 'image/jpeg',
        path: 'files/mri_results.jpg',
        icon: 'fas fa-file-image',
        date: 'February 28, 2025',
        size: '4.5 MB'
    },
    {
        id: 'file5',
        name: 'Medical History.pdf',
        type: 'application/pdf',
        path: 'files/medical_history.pdf',
        icon: 'fas fa-file-pdf',
        date: 'February 20, 2025',
        size: '5.8 MB'
    }
];

// Demo files for shared documents
const sharedFiles = [
    {
        id: 'shared1',
        name: 'Complete Medical History.pdf',
        type: 'application/pdf',
        path: 'files/complete_medical_history.pdf', // GitHub path
        icon: 'fas fa-file-pdf',
        date: 'March 18, 2025',
        size: '3.2 MB',
        sharedWith: 'Dr. Williams',
        expires: '7 days'
    },
    {
        id: 'shared2',
        name: 'Allergy Information.pdf',
        type: 'application/pdf',
        path: 'files/allergy_information.pdf', // GitHub path
        icon: 'fas fa-file-pdf',
        date: 'March 8, 2025',
        size: '1.8 MB',
        sharedWith: 'County Hospital',
        expires: '14 days'
    }
];

// DOM Elements
let uploadedFilesList;
let emptyFilesMessage;
let fileUploadInput;
let uploadArea;
let progressContainer;
let progressBar;
let progressText;

// Modals
let viewFileModal;
let shareFileModal;
let deleteConfirmModal;
let viewFileTitle;
let viewFileBody;
let deleteFileName;

// Current file being acted upon
let currentFile = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM element variables
    uploadedFilesList = document.getElementById('uploadedFilesList');
    emptyFilesMessage = document.getElementById('emptyFilesMessage');
    fileUploadInput = document.getElementById('fileUpload');
    uploadArea = document.getElementById('uploadArea');
    progressContainer = document.querySelector('.progress-container');
    progressBar = document.querySelector('.progress-bar');
    progressText = document.querySelector('.progress-text');
    
    // Initialize modal elements
    viewFileModal = document.getElementById('viewFileModal');
    shareFileModal = document.getElementById('shareFileModal');
    deleteConfirmModal = document.getElementById('deleteConfirmModal');
    viewFileTitle = document.getElementById('viewFileTitle');
    viewFileBody = document.getElementById('viewFileBody');
    deleteFileName = document.getElementById('deleteFileName');
    
    loadFiles();
    setupEventListeners();
});

// Load files into the UI
function loadFiles() {
    if (demoFiles.length === 0) {
        emptyFilesMessage.style.display = 'block';
        uploadedFilesList.style.display = 'none';
    } else {
        emptyFilesMessage.style.display = 'none';
        uploadedFilesList.style.display = 'block';
        
        // Clear the list first
        uploadedFilesList.innerHTML = '';
        
        // Add each file to the list
        demoFiles.forEach(file => {
            const fileItem = createFileListItem(file);
            uploadedFilesList.appendChild(fileItem);
        });
    }
}

// Create a file list item
function createFileListItem(file) {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.dataset.fileId = file.id;
    
    li.innerHTML = `
        <div class="file-icon">
            <i class="${file.icon}"></i>
        </div>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-meta">Uploaded on ${file.date} • ${file.size}</div>
        </div>
        <div class="file-actions">
            <button class="action-btn view-btn" title="View"><i class="fas fa-eye"></i></button>
            <button class="action-btn share-btn" title="Share"><i class="fas fa-share-alt"></i></button>
            <button class="action-btn download-btn" title="Download"><i class="fas fa-download"></i></button>
            <button class="action-btn delete-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    return li;
}

// Set up all event listeners
function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', function() {
        fileUploadInput.click();
    });
    
    // New upload button
    document.getElementById('newUploadBtn').addEventListener('click', function() {
        fileUploadInput.click();
    });
    
    // File selection
    fileUploadInput.addEventListener('change', handleFileSelection);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Mobile menu toggle
    document.querySelector('.hamburger').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.nav-menu').classList.toggle('active');
    });
    
    // Set up modal close buttons
    document.querySelectorAll('.close-modal, #closeViewBtn, #cancelShareBtn, #cancelDeleteBtn').forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Set up click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        if (currentFile) {
            // Find the file in the array and remove it
            const index = demoFiles.findIndex(file => file.id === currentFile);
            if (index !== -1) {
                demoFiles.splice(index, 1);
                
                // Update the UI
                loadFiles();
                
                // Close the modal
                closeAllModals();
            }
        }
    });
    
    // Confirm share button
    document.getElementById('confirmShareBtn').addEventListener('click', function() {
        const email = document.getElementById('shareWithEmail').value;
        const expiry = document.getElementById('accessExpiry').value;
        
        if (email && currentFile) {
            alert(`File shared with ${email} successfully. Access will expire in ${expiry === '0' ? 'never' : expiry + ' days'}.`);
            closeAllModals();
        } else {
            alert('Please enter a valid email address.');
        }
    });
    
    // Download button in view modal
    document.getElementById('downloadFromViewBtn').addEventListener('click', function() {
        if (currentFile) {
            const file = demoFiles.find(f => f.id === currentFile);
            if (file) {
                alert(`Downloading file: ${file.name}`);
                // In a real app, this would trigger the actual file download
            }
        }
    });
    
    // Set up action buttons - using event delegation
    uploadedFilesList.addEventListener('click', function(e) {
        // Find the file item
        const fileItem = e.target.closest('.file-item');
        if (!fileItem) return;
        
        const fileId = fileItem.dataset.fileId;
        const file = demoFiles.find(f => f.id === fileId);
        if (!file) return;
        
        // Determine which button was clicked
        if (e.target.closest('.view-btn')) {
            viewFile(file);
        } else if (e.target.closest('.share-btn')) {
            shareFile(file);
        } else if (e.target.closest('.download-btn')) {
            downloadFile(file);
        } else if (e.target.closest('.delete-btn')) {
            deleteFile(file);
        }
    });
    
    // Also set up similar event delegation for shared files
    document.getElementById('sharedFiles').addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const fileItem = e.target.closest('.file-item');
            const fileName = fileItem.querySelector('.file-name').textContent;
            // Find the file in the sharedFiles array
            const file = sharedFiles.find(f => f.name === fileName);
            if (file) {
                viewFile(file); // Use the same viewFile function
            } else {
                alert(`Viewing shared file: ${fileName}`);
            }
        } else if (e.target.closest('[title="Manage Access"]')) {
            const fileName = e.target.closest('.file-item').querySelector('.file-name').textContent;
            alert(`Managing access for: ${fileName}`);
        } else if (e.target.closest('[title="Revoke Access"]')) {
            const fileName = e.target.closest('.file-item').querySelector('.file-name').textContent;
            if (confirm(`Are you sure you want to revoke access to "${fileName}"?`)) {
                e.target.closest('.file-item').style.display = 'none';
            }
        }
    });
}

// Handle file selection
function handleFileSelection(e) {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
}

// Handle files (both from input and drag-drop)
function handleFiles(files) {
    progressContainer.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(function() {
        progress += 5;
        if (progress > 100) {
            clearInterval(interval);
            
            // Hide progress after "completion"
            setTimeout(function() {
                progressContainer.style.display = 'none';
                
                // Add files to our list
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    
                    // Determine icon based on file type
                    let icon = 'fas fa-file';
                    if (file.type.includes('pdf')) {
                        icon = 'fas fa-file-pdf';
                    } else if (file.type.includes('image')) {
                        icon = 'fas fa-file-image';
                    } else if (file.type.includes('word')) {
                        icon = 'fas fa-file-word';
                    }
                    
                    // Create a new file object
                    const newFile = {
                        id: 'file' + (demoFiles.length + 1),
                        name: file.name,
                        type: file.type,
                        path: URL.createObjectURL(file), // Create blob URL for preview
                        icon: icon,
                        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        size: formatFileSize(file.size)
                    };
                    
                    // Add to our files array
                    demoFiles.unshift(newFile); // Add to beginning to show newest first
                }
                
                // Update the UI
                loadFiles();
                
                // Reset file input
                fileUploadInput.value = '';
            }, 500);
        } else {
            progressBar.style.width = progress + '%';
            progressText.textContent = 'Uploading... ' + progress + '%';
        }
    }, 100);
}

// Format file size in KB, MB, etc.
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// View a file
function viewFile(file) {
    currentFile = file.id;
    viewFileTitle.textContent = file.name;
    
    // Clear previous content
    viewFileBody.innerHTML = '';
    
    // Create appropriate viewer based on file type
    if (file.type.includes('image')) {
        const img = document.createElement('img');
        img.src = file.path;
        img.className = 'file-viewer';
        img.alt = file.name;
        viewFileBody.appendChild(img);
    } else if (file.type.includes('pdf')) {
        // In a real app, use PDF.js or an iframe for PDFs
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-state';
        placeholder.innerHTML = `
            <i class="fas fa-file-pdf" style="font-size: 4rem; color: #dc3545;"></i>
            <h3>PDF Preview</h3>
            <p>This is a preview of ${file.name}</p>
        `;
        viewFileBody.appendChild(placeholder);
    } else {
        // Generic file preview
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-state';
        placeholder.innerHTML = `
            <i class="${file.icon}" style="font-size: 4rem;"></i>
            <h3>File Preview</h3>
            <p>Preview not available for this file type.</p>
        `;
        viewFileBody.appendChild(placeholder);
    }
    
    // Show the modal
    viewFileModal.style.display = 'block';
}

// Share a file
function shareFile(file) {
    currentFile = file.id;
    document.getElementById('shareFileTitle').textContent = `Share ${file.name}`;
    document.getElementById('shareWithEmail').value = '';
    document.getElementById('accessExpiry').value = '7'; // Default to 7 days
    
    // Show the modal
    shareFileModal.style.display = 'block';
}

// Download a file
function downloadFile(file) {
    // In a real app, this would use the file.path to trigger a download
    // For demo, we'll just show an alert
    alert(`Downloading file: ${file.name}`);
    
    // If it's a blob URL (user uploaded file), we can actually trigger a download
    if (file.path.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = file.path;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

// Delete a file
function deleteFile(file) {
    currentFile = file.id;
    deleteFileName.textContent = file.name;
    
    // Show the confirmation modal
    deleteConfirmModal.style.display = 'block';
}

// Close all modals
function closeAllModals() {
    viewFileModal.style.display = 'none';
    shareFileModal.style.display = 'none';
    deleteConfirmModal.style.display = 'none';
    currentFile = null;
}
