import { analytics, app, functions } from '../firebase';
import { httpsCallable } from "firebase/functions";
import { useState, useEffect } from 'react';
import { Dropzone, ExtFile, FileMosaic } from "@files-ui/react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Vortex } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { PriorFile } from './PriorFile';
import { logEvent } from "firebase/analytics";
import { toasterHelper } from './ToasterHelper';
import { Toaster } from 'react-hot-toast';

const newPDF = httpsCallable(functions, 'newPDF');

export function Homepage(this: any) {
  const navigate = useNavigate();
  const storage = getStorage(app,"gs://docability");
  const [files] = useState([])
  const [loading, setLoading] = useState(false);
  const [additionalDivs, setAdditionalDivs] = useState<JSX.Element[]>([]);


  useEffect(() => {
    const cookieValue = Cookies.get('PreviousDoc');
    if (cookieValue) {
      let parsedcookie = JSON.parse(cookieValue);
      setAdditionalDivs([
        <div key={1} className="grid place-items-center font-Exo">Or pick up where you left off</div>,
        <div key={2}>{PriorFile(parsedcookie.url, "", parsedcookie.filename, parsedcookie.filename)}</div>
      ]);
    }
  }, []);



  async function updateFiles(files: ExtFile[]): Promise<void> {
    logEvent(analytics, 'updateFiles', { name: files[0].name });
    if (files[0].type != "application/pdf") {
      toasterHelper("File is of wrong type ..  Please upload a PDF")
      setLoading(false);
      return;
    }

    const size = files[0]?.size as number;
    const convertedsize = size / 1000000;
    if (convertedsize > 15) {
      toasterHelper("File size exceeds 15MB, Please upload a smaller PDF ")
      setLoading(false);
      return;
    }
    toasterHelper("Stand by while we process this file.")
    
    setLoading(true);

    let randomstring = generateRandom16DigitString();
    
    const storageRef = ref(storage, randomstring);


    let arraybuffer = new Response(files[0].file).arrayBuffer();;

    uploadBytes(storageRef, await arraybuffer).then((snapshot) => {

      getDownloadURL(ref(storage, randomstring))
        .then((url) => {
          var json = { param1: randomstring, param2: url, param3: "notaquery" }
          newPDF(json)
            .then((result) => {
              const data = result.data;
              setLoading(false);
              console.log(url);
              const urlWithoutProtocol = url.replace(/^https:\/\//, '');
              const jsonObject = { filename: files[0].name, url: `/ChatUI/${encodeURIComponent(urlWithoutProtocol)}/${encodeURIComponent(randomstring)}` };
              Cookies.set('PreviousDoc', JSON.stringify(jsonObject), { expires: 7 });
              navigate(`/ChatUI/${encodeURIComponent(urlWithoutProtocol)}/${encodeURIComponent(randomstring)}`);
            })

        })
        .catch((error) => {
          toasterHelper("We seem to be experiencing an error...please try again later.")
        });
    });
  }

  return (
    <>
      <div><Toaster /></div>
      <div className="grid grid-rows-3 place-items-center drop-shadow-2xl" >
      <div className="text-2xl font-exp">AI assisted interactions with a PDF: Ask Questions, Summarize, and Learn.</div>
        {!loading ? <div className="drop-shadow-2xl"><Dropzone
          background="radial-gradient(circle at 50% 50%, rgb(50, 150, 250) 0%, rgb(125, 134, 238) 50%);"
          onChange={updateFiles}
          value={files}
          accept="application/pdf"
          label="Drag 'n drop any PDF file less than 15 MB here or click to get started "
          minHeight="350px"
          header={false}
          footer={false}
          color="white"
          style={{ width: "500px" }}
        ></Dropzone></div>
          :<div>
          <Vortex
            visible={loading}
            height="300"
            width="300"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['rgb(50, 150, 250)', 'rgb(125, 134, 238)', 'rgb(50, 150, 250)', 'rgb(125, 134, 238)', 'rgb(50, 150, 250)', 'rgb(125, 134, 238)']}
          />Stand by we are actively processing the file</div>
        }
        <div className="max-h-128"> {additionalDivs}</div>
      </div>

    </>
  );
}

function generateRandom16DigitString(): string {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
  const day = currentDate.getDate();
  let date = `${year}-${month}-${day}`;
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 16;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return date + "-" + result;

}







