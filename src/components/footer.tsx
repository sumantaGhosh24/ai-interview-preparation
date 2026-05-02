const Footer = () => {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto container max-w-[80%] flex items-center justify-between gap-5 flex-wrap py-2">
        <p>Sumanta Ghosh</p>
        <p>sumantaghosh5333@gmail.com</p>
        <a
          href="https://github.com/sumantaGhosh24"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition hover:text-foreground"
        >
          GitHub Profile
        </a>
        <a
          href="https://www.linkedin.com/in/sumantaghosh24"
          target="_blank"
          rel="noopener noreferrer"
          className="block transition hover:text-foreground"
        >
          LinkedIn Profile
        </a>
      </div>
    </footer>
  );
};

export default Footer;
