/** SimpleText-style viewer for README.txt and other plain text files. */
export default function TextFileApp({ text }: { text: string }) {
  return (
    <pre className="min-h-full p-4 whitespace-pre-wrap select-text" style={{ fontFamily: '"VT323", "Courier New", monospace', fontSize: 19, lineHeight: 1.2 }}>
      {text}
    </pre>
  );
}
