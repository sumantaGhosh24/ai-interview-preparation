const Footer = () => {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto grid container gap-10 px-6 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-bold">AI Interview Prep</h3>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Practice smarter with AI-generated interview questions, instant answer evaluation, and
            personalized learning paths.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Platform</h4>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>AI Evaluation</p>
            <p>Learning Path Generator</p>
            <p>Adaptive Questions</p>
            <p>Performance Tracking</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Resources</h4>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <p>Documentation</p>
            <p>Blog</p>
            <p>FAQs</p>
            <p>Support</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Contact</h4>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
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
        </div>
      </div>
      <div className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        © 2026 AI Interview Prep Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
