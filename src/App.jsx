import { useState, useRef ,useEffect} from 'react'
import { marked } from 'marked'
import './App.css'
import { trackPageView } from './tracking.js'

function App() {
  useEffect(() => {
    // Track page view after component mounts
    trackPageView();
  }, []);
  
  const [markdownContent, setMarkdownContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [showAllFiles, setShowAllFiles] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)
    
    try {
      const text = await file.text()
      setMarkdownContent(text)
    } catch (error) {
      setMarkdownContent('**Error:** Unable to read file.')
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  const toggleFileFilter = () => {
    setShowAllFiles(!showAllFiles)
    // Reset the input to apply new filter
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const htmlContent = markdownContent ? marked(markdownContent) : ''

  return (
    <div className="app-container">
      <header className="header">
        <h1>📝 Markdown Viewer</h1>
        <div className="controls">
          <button onClick={handleBrowseClick} className="btn-primary">
            Browse Files
          </button>
          <button onClick={toggleFileFilter} className="btn-secondary">
            {showAllFiles ? '📄 Show MD Files Only' : '📁 Show All Files'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={showAllFiles ? '*' : '.md,.markdown'}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        {fileName && <p className="file-name">Current file: {fileName}</p>}
      </header>

      <main className="content">
        {markdownContent ? (
          <div 
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <div className="placeholder">
            <div className="placeholder-content">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
              <h2>No File Selected</h2>
              <p>Click "Browse Files" to select a markdown file</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
