import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  ChevronRight,
  Code2,
  Cpu,
  ExternalLink,
  Globe,
  Github,
  Layers,
  Linkedin,
  Mail,
  Menu,
  MessageSquare,
  Palette,
  Phone,
  Send,
  SendHorizontal,
  Sparkles,
  Terminal,
  X,
  Zap
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Types ---
interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  stars?: number;
  language?: string;
  updated?: string;
}

interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  stargazers_count: number;
  language: string;
  updated_at: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface SkillCategory {
  title: string;
  Icon: React.ElementType;
  iconColor: string;
  items: string[];
}

// --- Hooks ---
const useReveal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// --- Components ---

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm CHRISTTech's AI assistant. Ask me anything about machine learning, robotics projects, or tech stack!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp",
        systemInstruction: `You are an AI assistant for CHRISTTech, a Machine Learning and Robotics Engineer. 
            Bio: Expert in ML/AI, robotics systems, Python development, and mobile applications. 
            Stack: TensorFlow, PyTorch, ROS, Python, Flutter, React Native, FastAPI, Computer Vision. 
            Personality: Technical, innovative, passionate about AI and robotics. 
            Location: Remote.
            Focus: Machine learning models, robotics automation, Python tools, mobile apps.
            Be concise, technical yet friendly, and helpful. Always respond as CHRISTTech's assistant.`,
      });

      const result = await model.generateContent(userMsg);
      const aiResponse = result.response.text() || "I'm having a little glitch. Can you try again?";
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Connection issues. Alex must be coding something big!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 glass rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-blue-400" />
              <span className="font-bold text-sm tracking-tight">AI Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/40">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'msg-user text-white' : 'msg-ai text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="msg-ai p-3 rounded-xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-900/60 border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about my projects..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-sm outline-none focus:border-blue-500/50 transition-all text-white"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 glass shadow-2xl' : 'py-6 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Code2 size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-text">CHRIST</span>TECH
          </span>
        </a>

        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-bold transition-all hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 text-white"
          >
            GET IN TOUCH
          </a>
        </div>

        <button
          className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/5 animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col p-8 space-y-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-bold hover:text-blue-400 transition-colors text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}.
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[35rem] h-[35rem] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse [animation-delay:2s]"></div>

      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Available for new projects
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white">
            Building <br />
            <span className="gradient-text">Intelligent</span> <br />
            Systems.
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
            Machine Learning & Robotics Engineer specializing in AI-driven solutions, autonomous systems, and intelligent mobile applications.
          </p>

          <div className="flex flex-wrap gap-5 pt-4">
            <a href="#projects" className="px-10 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-extrabold transition-all hover:-translate-y-1 flex items-center gap-3">
              EXPLORE WORK <ArrowRight size={20} />
            </a>
            <a href="#contact" className="px-10 py-5 glass border border-white/10 hover:border-white/20 rounded-2xl font-extrabold transition-all flex items-center gap-3 text-white">
              LET'S CHAT
            </a>
          </div>

          <div className="flex items-center gap-8 pt-8 opacity-40 hover:opacity-100 transition-opacity">
            <a href="https://github.com/ChristTech" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors text-white"><Github size={22} /></a>
            <a href="https://www.linkedin.com/in/christtech" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors text-white"><Linkedin size={22} /></a>
            <a href="mailto:adebisivictor39@gmail.com" className="hover:text-blue-500 transition-colors text-white"><Mail size={22} /></a>
          </div>
        </div>

        <div className="lg:col-span-5 relative hidden lg:block">
          <div className="relative z-10 p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 backdrop-blur-xl floating">
            <div className="bg-[#020617]/90 rounded-[2.3rem] overflow-hidden p-10 border border-white/5 shadow-2xl">
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="mono space-y-4 text-sm md:text-base text-white">
                <p><span className="text-blue-400">const</span> <span className="text-purple-400">profile</span> = {'{'}</p>
                <p className="pl-6">name: <span className="text-emerald-400">'CHRISTTech'</span>,</p>
                <p className="pl-6">role: <span className="text-emerald-400">'ML & Robotics Engineer'</span>,</p>
                <p className="pl-6">focus: <span className="text-emerald-400">'AI & Automation'</span>,</p>
                <p className="pl-6">status: <span className="text-blue-400">'Building the Future'</span></p>
                <p>{'};'}</p>
                <div className="pt-4 border-t border-white/5 mt-4">
                  <p className="text-gray-500">// Terminal ready...</p>
                  <p className="text-emerald-400 flex items-center gap-2">
                    <ChevronRight size={14} /> npm install success
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 glass rounded-full flex items-center justify-center animate-spin-slow">
            <Globe className="text-blue-400" size={48} />
          </div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 glass rounded-3xl flex items-center justify-center rotate-12">
            <Zap className="text-yellow-400" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const { ref, isVisible } = useReveal();

  return (
    <div
      ref={ref as any}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={`group relative glass rounded-[2rem] overflow-hidden border border-white/5 hover:border-blue-500/40 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-out reveal ${isVisible ? 'visible' : ''}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          {project.github && (
            <a href={project.github} className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors text-white">
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-500 uppercase">{project.category}</span>
            <h3 className="text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors text-white">{project.title}</h3>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 tracking-wider">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-6 mt-2 border-t border-white/5 flex items-center justify-between">
          <a href={project.link} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors">
            View Project <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      try {
        // Get GitHub token from environment
        const token = (import.meta as any).env?.VITE_GITHUB_TOKEN;

        // Fetch repositories with authentication
        const response = await fetch('https://api.github.com/users/ChristTech/repos?sort=updated&per_page=20', {
          headers: token ? {
            'Authorization': `token ${token}`
          } : {}
        });
        if (!response.ok) throw new Error('Failed to fetch repositories');

        const repos: GitHubRepo[] = await response.json();

        // Filter out profile readme and projects without descriptions
        const validRepos = repos.filter(repo =>
          !repo.name.includes('ChristTech') && // Filter out profile readme
          repo.description // Has a description (indicates a real, documented project)
        );

        // Shuffle for variety on each page load
        const shuffled = validRepos.sort(() => Math.random() - 0.5);

        // Map to project format and take top 6
        const mappedProjects: Project[] = shuffled
          .slice(0, 6)
          .map(repo => ({
            title: repo.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            category: repo.language || 'Open Source',
            description: repo.description || 'An innovative project showcasing technical excellence.',
            image: `https://opengraph.githubassets.com/1/${repo.html_url.replace('https://github.com/', '')}`,
            tags: repo.topics.length > 0 ? repo.topics.slice(0, 4) : [repo.language || 'Code'],
            link: repo.homepage || repo.html_url,
            github: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language,
            updated: new Date(repo.updated_at).toLocaleDateString()
          }));

        setProjects(mappedProjects);
        setLoading(false);
      } catch (err) {
        console.error('GitHub API Error:', err);
        setError('Unable to load projects');
        setLoading(false);
      }
    };

    fetchGitHubProjects();
  }, []);

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Portfolio</h2>
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white">Latest <span className="gradient-text">Projects.</span></h3>
          </div>
          <p className="text-gray-400 max-w-md font-medium leading-relaxed">
            Building intelligent systems that combine machine learning, robotics, and cutting-edge software engineering.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, idx) => (
              <ProjectCard key={proj.title} project={proj} index={idx} />
            ))}
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <a href="https://github.com/ChristTech" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-8 py-4 glass border border-white/10 rounded-2xl font-bold hover:bg-white/5 transition-all text-white">
            VIEW ALL ON GITHUB <Github className="group-hover:rotate-12 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const { ref, isVisible } = useReveal();
  const categories: SkillCategory[] = [
    {
      title: "Machine Learning & AI",
      Icon: Cpu,
      iconColor: "text-blue-400",
      items: ["TensorFlow / PyTorch", "Scikit-learn", "Computer Vision", "NLP & LLMs", "Model Deployment"]
    },
    {
      title: "Robotics & Hardware",
      Icon: Zap,
      iconColor: "text-purple-400",
      items: ["ROS", "Arduino / Raspberry Pi", "Sensor Integration", "Control Systems", "Embedded Systems"]
    },
    {
      title: "Development Stack",
      Icon: Layers,
      iconColor: "text-pink-400",
      items: ["Python (Core)", "Flutter / React Native", "FastAPI / Django", "Docker / Kubernetes", "Git & CI/CD"]
    }
  ];

  return (
    <section id="skills" className="py-32 bg-[#020617]/50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Capabilities</h2>
          <h3 className="text-3xl sm:text-5xl md:text-6xl font-black text-white">Technical <span className="gradient-text">DNA.</span></h3>
        </div>

        <div ref={ref as any} className={`grid md:grid-cols-3 gap-8 reveal ${isVisible ? 'visible' : ''}`}>
          {categories.map((cat) => (
            <div key={cat.title} className="p-10 glass rounded-[2.5rem] hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 ${cat.iconColor}`}>
                <cat.Icon size={120} />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <cat.Icon className={cat.iconColor} size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-8 tracking-tight text-white">{cat.title}</h4>
              <ul className="space-y-4">
                {cat.items.map((item) => (
                  <li key={item} className="flex items-center gap-4 text-gray-400 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    setErrorMessage('');

    const formData = new FormData(e.target as HTMLFormElement);

    // Get your access key from https://web3forms.com
    // Add it to your .env.local file as VITE_WEB3FORMS_KEY
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';

    formData.append('access_key', accessKey);
    formData.append('subject', 'New Contact Form Submission from CHRISTTech Portfolio');
    formData.append('from_name', 'CHRISTTech Portfolio');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormState('success');
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setFormState('error');
        setErrorMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setFormState('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="glass rounded-2xl sm:rounded-[3.5rem] p-6 sm:p-10 md:p-20 grid lg:grid-cols-2 gap-10 sm:gap-20 items-center relative overflow-hidden border border-white/5">
          <div className="space-y-10 relative z-10">
            <div className="space-y-4">
              <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Get in touch</h2>
              <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
                Let's build <br />
                the <span className="gradient-text">Future.</span>
              </h3>
            </div>

            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">
              Whether you have a groundbreaking idea or just want to discuss the latest tech stack, my door is always open.
            </p>

            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Email Address</p>
                  <p className="text-xl font-bold text-white">adebisivictor39@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="text-green-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">WhatsApp</p>
                  <a href="https://wa.me/2349018114203" target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-white hover:text-green-400 transition-colors">Chat on WhatsApp</a>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Location</p>
                  <p className="text-xl font-bold text-white">Remote</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            {formState === 'success' ? (
              <div className="glass p-12 rounded-[2.5rem] border border-green-500/20 text-center space-y-6 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="text-green-500" size={32} />
                </div>
                <h4 className="text-3xl font-bold text-white">Message Sent!</h4>
                <p className="text-gray-400">CHRISTTech will get back to you faster than a neural network trains!</p>
                <button
                  onClick={() => setFormState('idle')}
                  className="px-8 py-3 glass rounded-xl text-sm font-bold text-white"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="glass p-10 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Name</label>
                    <input
                      name="name"
                      required
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all font-medium text-white"
                      placeholder="E.g. Adebisi Victor"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</label>
                    <input
                      name="email"
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all font-medium text-white"
                      placeholder="victor@gmail.com"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Message</label>
                  <textarea
                    name="message"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500/50 transition-all font-medium min-h-[140px] text-white"
                    placeholder="Let's work together..."
                  ></textarea>
                </div>

                {formState === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="w-full py-5 bg-white text-black hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed rounded-2xl font-black transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  {formState === 'loading' ? 'Transmitting...' : (
                    <>
                      Send Transmission <SendHorizontal size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/5">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
          <Code2 size={12} className="text-white" />
        </div>
        <span className="text-lg font-black tracking-tight text-white">CHRISTTECH<span className="text-blue-500">.</span></span>
      </div>

      <div className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} CHRISTTech. Building Intelligent Systems.
      </div>

      <div className="flex items-center gap-6">
        <a href="https://github.com/ChristTech" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-xl hover:text-blue-400 transition-all text-white"><Github size={18} /></a>
        <a href="https://www.linkedin.com/in/christtech" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-xl hover:text-blue-400 transition-all text-white"><Linkedin size={18} /></a>
        <a href="mailto:adebisivictor39@gmail.com" className="p-3 glass rounded-xl hover:text-blue-400 transition-all text-white"><Mail size={18} /></a>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      <Navbar />
      <Hero />

      <div id="about" className="py-32 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          <div className="flex-1 space-y-10 order-2 lg:order-1">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">About CHRISTTech</h2>
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white">Driven by <br />Innovation <span className="gradient-text">&amp; AI.</span></h3>
            <div className="space-y-6 text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
              <p>
                I am a passionate robotics engineer who aims to develop robotics systems that work seamlessly with artificial intelligence to help people, especially in the health sector.
              </p>
              <p>
                I also tutor young aspiring robotics engineers and enthusiasts, sharing my knowledge and passion for building intelligent systems that solve real-world problems.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="space-y-2">
                <div className="text-5xl font-black tracking-tighter gradient-text">ML</div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Models Deployed</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-black tracking-tighter gradient-text">AI</div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Driven Systems</div>
              </div>
              <div className="space-y-2">
                <div className="text-5xl font-black tracking-tighter gradient-text">IOT</div>
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Robotics Projects</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full order-1 lg:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-[3rem] blur-2xl group-hover:scale-105 transition-transform duration-700"></div>
              <div className="aspect-[4/5] glass rounded-[2.5rem] overflow-hidden relative z-10">
                <img
                  src="/Myself2.png"
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 p-8 glass border-white/5 rounded-3xl">
                  <div className="font-bold text-2xl tracking-tight text-white">CHRISTTech</div>
                  <div className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-1">ML & Robotics Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Projects />
      <Skills />
      <Contact />
      <Footer />
      <AIChat />
    </div>
  );
};

// Rendering the app
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
} catch (e) {
  console.error("Rendering failed:", e);
}