/** SimpleText-style viewer for README.txt and other plain text files. */
export default function TextFileApp({ text }: { text: string }) {
  return (
    <pre
      className="min-h-full p-4 whitespace-pre-wrap select-text text-[#29271f]"
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
        fontSize: 15,
        lineHeight: 1.6,
      }}
    >
      {text}
    </pre>
  );
}
