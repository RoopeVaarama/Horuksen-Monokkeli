import { useState } from 'react'
import { SearchResult } from '../../../types'
// eslint-disable-next-line prettier/prettier, unused-imports/no-unused-imports
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack5'
import { getToken } from '../../../tools/auth'
import { IconButton } from '@mui/material'
import { SkipNext, SkipPrevious } from '@mui/icons-material'
import { PDFPageProxy } from 'react-pdf'

const PdfView = ({
  fileId,
  results,
  width = document.body.clientWidth * 0.6
}: {
  fileId: string
  results?: SearchResult[]
  /**
   * Max width should come from parent. PDF Viewer doesn't seem to respect boundaries at all,
   * and will just use PDF page width. Has to be exact number I guess, so maybe get container
   * element ref in parent and clientWidth from that? Before rendering this PdfView ofc.
   */
  width?: number
}) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

  const url = `${process.env.REACT_APP_BACKEND_URL}/files/read/${fileId}`
  const docRequestObject = {
    url,
    httpHeaders: {
      Authorization: `Bearer ${getToken()}`
    }
  }

  const svgMargin = 10
  const svgYOffset = -2
  const svgXOffset = -5

  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)

  const [scale, setScale] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  function onPageLoadSuccess(page: PDFPageProxy) {
    setScale(page.height / page.originalHeight)
  }

  return (
    <div className='pdfViewContainer' style={{ position: 'relative', margin: 0 }}>
      {numPages > 1 && (
        <div className='buttonContainer' style={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton
            disabled={pageNumber <= 1}
            onClick={() => (pageNumber > 1 ? setPageNumber(pageNumber - 1) : null)}
          >
            <SkipPrevious></SkipPrevious>
          </IconButton>
          <IconButton
            disabled={pageNumber >= numPages}
            onClick={() => (pageNumber < numPages ? setPageNumber(pageNumber + 1) : null)}
          >
            <SkipNext></SkipNext>
          </IconButton>
        </div>
      )}
      <div className='pdfDocumentContainer' style={{ position: 'relative', margin: 0 }}>
        <Document file={docRequestObject} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            width={width}
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadSuccess={onPageLoadSuccess}
          />
        </Document>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {results
            ?.filter((result) => result.page === pageNumber)
            .map((result) => (
              <>
                <svg
                  key={'key-' + result.key}
                  width={svgMargin + scale * result.key_width}
                  height={svgMargin + scale * result.key_height}
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    top: svgYOffset + scale * ((result.key_y ?? 0) - (result.key_height ?? 0)),
                    left: svgXOffset + scale * (result.key_x ?? 0)
                  }}
                >
                  <rect
                    width={svgMargin + scale * result.key_width}
                    height={svgMargin + scale * result.key_height}
                    style={{ fillOpacity: 0, strokeWidth: 3, stroke: 'rgb(0,0,255)' }}
                  />
                </svg>
                {result.val_x && result.val_y && (
                  <svg
                    key={result.key}
                    width={svgMargin + scale * (result.value_width ?? 0)}
                    height={svgMargin + scale * (result.value_height ?? 0)}
                    style={{
                      position: 'absolute',
                      zIndex: 1,
                      top: svgYOffset + scale * ((result.val_y ?? 0) - (result.value_height ?? 0)),
                      left: svgXOffset + scale * (result.val_x ?? 0)
                    }}
                  >
                    <rect
                      width={svgMargin + scale * (result.value_width ?? 0)}
                      height={svgMargin + scale * (result.value_height ?? 0)}
                      style={{ fillOpacity: 0, strokeWidth: 3, stroke: 'rgb(255,0,0)' }}
                    />
                  </svg>
                )}
              </>
            ))}
        </div>
      </div>
    </div>
  )
}

export default PdfView
