import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faFilePdf } from '@fortawesome/free-solid-svg-icons'


export function PriorFile(imageUrl:string, imageAlt:string, title:string, message:string) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div className="shrink-0">
        <FontAwesomeIcon icon={faFilePdf} size="2xl" style={{color: "#73a2f2",}} />
        </div>
        <div>
          <a href={imageUrl}><div className="text-xl font-medium text-black hover:underline font-Exo">{title}</div></a>
        </div>
      </div>
    )
  }