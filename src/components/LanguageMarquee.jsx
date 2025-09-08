// LanguageMarquee.jsx
export default function LanguageMarquee() {
  return (
    <div className='w-screen py-3 overflow-hidden bg-blue-600'>
      <div className='relative flex whitespace-nowrap'>
        {/* First set of texts */}
        <div className='flex animate-marquee'>
          <span className='mx-6 text-lg font-medium text-white'>
            Welcome - English
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Bienvenido - Español
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Bienvenue - Français
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Willkommen - Deutsch
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Benvenuto - Italiano
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            أهلا بك - العربية
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            欢迎 - 中文
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            स्वागत है - हिन्दी
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Добро пожаловать - Русский
          </span>
        </div>

        {/* Duplicate set for seamless loop */}
        <div className='flex animate-marquee' aria-hidden='true'>
          <span className='mx-6 text-lg font-medium text-white'>
            Welcome - English
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Bienvenido - Español
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Bienvenue - Français
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Willkommen - Deutsch
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Benvenuto - Italiano
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            أهلا بك - العربية
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            欢迎 - 中文
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            स्वागत है - हिन्दी
          </span>
          <span className='mx-6 text-lg font-medium text-white'>
            Добро пожаловать - Русский
          </span>
        </div>
      </div>
    </div>
  );
}
