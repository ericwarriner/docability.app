
import React, { Fragment, useState } from 'react';
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";



export function FAQ() {
    const [open, setOpen] = useState(1);

    const handleOpen = (value: React.SetStateAction<number>) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <>
            <section className="mt-8 mx-64 px-4 lg:px-0 bg-white shadow-2xl font-Exo">
                <div className="flex flex-col-reverse lg:grid grid-cols-1 gap-12 px-4">
                    <div>
                        <h1 className="mb-2 text-4xl font-extrabold tracking-wide">Frequently Asked Questions </h1>

                        <Fragment>
                        <Accordion open={open === 1}>
                                <AccordionHeader onClick={() => handleOpen(1)}>
                                    Who are the intended audience?
                                </AccordionHeader>
                                <AccordionBody>
                                    <p className="text-gray-600 p-6">
                                    Anyone utilizing PDF documents as part of their daily work flow to include students, researchers, educators, business professionals who
                                    can benefit from AI assisted queries upon the PDF document.
                                    </p>
                                </AccordionBody>
                            </Accordion>
                            <Accordion open={open === 2}>
                                <AccordionHeader onClick={() => handleOpen(2)}>
                                    How long are the PDFs stored?
                                </AccordionHeader>
                                <AccordionBody>
                                    <p className="text-gray-600 p-6">

                                        In an effort to provide the best user experience:

                                        We store your PDF in Google Cloud for a period of 3 days.

                                        Once 3 days have expired, the PDF document is automatically deleted.
                                        Please review our 
                                        <a href="/privacy" rel="noreferrer" className="underline">
                                        {' '} Privacy Policy{' '}
                                        </a> for more information.

                                    </p>
                                </AccordionBody>
                            </Accordion>
                            <Accordion open={open === 3}>
                                <AccordionHeader onClick={() => handleOpen(3)}>
                                    Which AI Engine and technologies are used?
                                </AccordionHeader>
                                <AccordionBody>
                                    <p className=" text-gray-600 p-6">
                                        Google Palm API is used for Embeddings and LLM requests.
                                        Google Firebase provides hosting and storage services.
                                        ChromaDB is used to store and query embeddings.
                                        Langchain is used to integrate services.
                                    </p>
                                </AccordionBody>
                            </Accordion>
                        </Fragment>
                        <div className="mt-6">
                            <div className="flex items-center mt-4">
                                <div className="flex-grow">
                                </div>
                                <div className="flex items-center justify-center px-8 mt-6 text-gray-600">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}