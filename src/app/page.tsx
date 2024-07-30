"use client";
import React, { SVGProps, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { handleFileUpload } from "./server";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
import { Loader2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
  accept: {
    "application/x-msdownload": [".exe"],
  },
};

export default function Home() {
  const [fileDetails, setFileDetails] = useState<Record<string, any> | null>(
    null
  );
  const [result, setResult] = useState<string | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async () => {
    const file = files?.[0];
    if (file) {
      setLoading(true);
      const fileDetails = await readFileAndUpload(file);
      const response = fileDetails[0];
      setLoading(false);
      if (response.includes("Error")) {
        toast.error(response);
      } else {
        toast.success(response);

        setFileDetails(response);
        setResult(
          response.prediction === "legitimate"
            ? "legitimate"
            : "File is ransomware"
        );
      }
    }
  };

  const readFileAndUpload = (file: File) => {
    return new Promise<any>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target?.result;
        const fileObject = {
          name: file.name,
          type: file.type,
          size: file.size,
          content: fileContent,
        };
        const fileDetails = await handleFileUpload(fileObject);
        resolve(fileDetails);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#000]">
      <Toaster richColors />

      <div className="w-full max-w-2xl mx-auto bg-[#1e293b] rounded-xl p-8 text-white">
        <div className="space-y-4">
          <Header />
          <div className="flex items-center gap-4">
            <FileUploader
              value={files}
              onValueChange={setFiles}
              dropzoneOptions={dropZoneConfig}
              className="relative bg-black rounded-lg p-2"
            >
              <FileInput className="outline-dashed outline-1 outline-white">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                  <FileSvgDraw />
                </div>
              </FileInput>
              <FileUploaderContent>
                {files &&
                  files.length > 0 &&
                  files.map((file, i) => (
                    <FileUploaderItem key={i} index={i}>
                      <Paperclip className="h-4 w-4 stroke-current" />
                      <span>{file.name}</span>
                    </FileUploaderItem>
                  ))}
              </FileUploaderContent>
            </FileUploader>
            <Button disabled={!files} onClick={handleFileChange}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
          {result && <ResultMessage result={result} />}
          {fileDetails && <FileDetailsTable fileDetails={fileDetails} />}
        </div>
      </div>
    </main>
  );
}

const Header = () => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold">Ransomware Detector</h1>
    <p className="text-muted-foreground">
      Upload a file to check if its ransomware or legitimate.
    </p>
  </div>
);

const FileSvgDraw = () => (
  <>
    <svg
      className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
      />
    </svg>
    <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
      <span className="font-semibold">Click to upload</span>
      &nbsp; or drag and drop
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400">EXE only</p>
  </>
);

const ResultMessage = ({ result }: { result: string }) => (
  <div
    className={`rounded-md bg-[#0f172a] p-4 text-sm ${
      result === "legitimate" ? "text-green-500" : "text-red-500"
    }`}
  >
    <div className="flex items-center gap-2">
      {result === "legitimate" ? (
        <CheckIcon className="h-5 w-5" />
      ) : (
        <XIcon className="h-5 w-5" />
      )}
      <span>{result}</span>
    </div>
  </div>
);

const FileDetailsTable = ({
  fileDetails,
}: {
  fileDetails: Record<string, any>;
}) => (
  <div className="rounded-md bg-[#0f172a] p-4 text-sm">
    <h2 className="text-lg font-medium mb-2">File Details</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.keys(fileDetails).map((key) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{fileDetails[key]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
