import React, { ChangeEvent, FormEvent, ReactElement, useEffect, useRef, useState } from 'react';
import { analytics, app, functions } from '../firebase';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer, LoadError } from '@react-pdf-viewer/core';
import { ToolbarProps, ToolbarSlot, defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useParams } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { toasterHelper } from './ToasterHelper';

const newPDF = httpsCallable(functions, 'newPDF');

interface Item {
    name: string,
    message: string,
    createdAt: Date,
}

export function ChatUI() {
    const storage = getStorage(app, "gs://docability");
    const { fileurl, sessionId } = useParams<{ fileurl: string, sessionId: string }>();
    const fileTypes = ["PDF"];
    const [text, setText] = useState<string>('');
    const [divs, setDivs] = useState<ReactElement[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false); // To track loading state

    useEffect(() => {

        // Function to keep scroll at bottom
        const scrollToBottom = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        };

        // Scroll to bottom initially
        scrollToBottom();
        const observer = new MutationObserver(scrollToBottom);
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            observer.observe(scrollContainer, { childList: true, subtree: true });
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const addDiv = (text: string, alignRight: boolean) => {
        if (alignRight) {
            setDivs((prevDivs) => [...prevDivs, <div className="flex justify-end"><div key={prevDivs.length} className="new-div bg-white rounded-xl shadow-lg max-w-xs break-words m-4 p-4">{text}</div></div>]);
        } else {
            setDivs((prevDivs) => [...prevDivs, <div key={prevDivs.length} className="new-div bg-white rounded-xl shadow-lg max-w-xs break-words m-4 p-4">{text}</div>]);
        }
    };

    const handleChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmitforTextArea();
    };



    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            handleSubmitforTextArea(); // Call the handleChangeTextArea explicitly
        }
    };
    const handleSubmitforTextArea = () => {
        // Handle form submission logic here
        setIsLoading(true)
        logEvent(analytics, 'new query', { name: sessionId });
        //console.log('Form submitted with value:', text);
        setText('');
        if (text.length > 3) {
          
            addDiv(text, false);
        }
        

        var json = { param1: sessionId, param3: "query", param4: text + " " + sessionId }
    
        newPDF(json)
            .then((result) => {
                const data: string = result.data as string;
                // console.log("Data" + data)
                addDiv(data, true);
                setIsLoading(false)
            })
            .catch((error) => {
                // Getting the Error details.
                const code = error.code;
                const message = error.message;
                const details = error.details;
                //  console.log("Error" + code + " " + message + " " + details);
                setIsLoading(false)
                toasterHelper("We seem to be experiencing an error...please try again later.")
            });

    };

    const renderErrors = (error: LoadError) => {
        let message = '';
        switch (error.name) {
            case 'InvalidPDFException':
                message = 'The document is invalid or corrupted';
                break;
            case 'MissingPDFException':
                message = 'Please Upload a PDF Document';
                break;
            case 'UnexpectedResponseException':
                message = 'Unexpected server response';
                break;
            default:
                message = 'Cannot load the document';
                break;
        }

        return (
            <div
                style={{
                    alignItems: 'center',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#e53e3e',
                        borderRadius: '0.25rem',
                        color: '#fff',
                        padding: '0.5rem',
                    }}
                >
                    {message}
                </div>
            </div>
        );
    };
    const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
        <Toolbar>
            {(slots: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    Download,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Print,
                    ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                } = slots;
                return (
                    <div
                        style={{
                            alignItems: 'center',
                            display: 'flex',
                            width: '100%',
                        }}
                    >
                        <div style={{ padding: '0px 2px' }}>
                            <ShowSearchPopover />
                        </div>
                        <div style={{ padding: '0px 4px', marginLeft: 'auto' }}>
                            <ZoomOut />
                        </div>
                        <div style={{ padding: '0px 4px' }}>
                            <Zoom />
                        </div>
                        <div style={{ padding: '0px 4px' }}>
                            <ZoomIn />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToPreviousPage />
                        </div>
                        <div style={{ padding: '0px 2px', width: '4rem' }}>
                            <CurrentPageInput />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            / <NumberOfPages />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <GoToNextPage />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <Print />
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });



    return (

        <div className="grid grid-cols-3 gap-10 max-h-screen ">
            <div
                className="bg-white rounded-xl shadow-lg col-span-2 max-h-screen"
            >
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer fileUrl={"https://"+fileurl as string} plugins={[defaultLayoutPluginInstance]} renderError={renderErrors} />
                </Worker>

            </div>

            <div className="flex flex-col rounded-xl shadow-2xl max-h-screen m-1">
                <div id="scrollContainer" ref={scrollContainerRef} className="flex-grow bg-gradient-to-t from-purple-200 to-blue-100 overflow-y-scroll">

                    {divs.map((div, index) => (
                        <React.Fragment key={index}>{div}</React.Fragment>
                    ))}

                </div>
                <div className="relative">
                    <form onSubmit={handleSubmit}>
                        <div className="block p-2.5 w-full text-sm text-gray-900 bg-gray-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <textarea
                                rows={5}
                                cols={20}
                                value={text}
                                onKeyDown={handleKeyDown} // Use 'onKeyDown' instead of 'onKeyPress'
                                onChange={handleChangeTextArea}
                                placeholder="Enter your query here..."
                                className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
                            ></textarea>
                        </div>
                        <button
                            type="submit" disabled={isLoading}
                            className="absolute right-2 bottom-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-600 focus:ring focus:outline-none"
                        >
                            {isLoading ? 'Querying...' : 'Ask'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}



