export default function LanguageMarquee() {
  return (
    <div className='w-full py-3 overflow-hidden bg-blue-600'>
      <div className='text-lg font-medium text-white animate-marquee whitespace-nowrap'>
        <span className='mx-6'>Welcome - English</span>
        <span className='mx-6'>Bienvenido - Español</span>
        <span className='mx-6'>Bienvenue - Français</span>
        <span className='mx-6'>Willkommen - Deutsch</span>
        <span className='mx-6'>Benvenuto - Italiano</span>
        <span className='mx-6'>أهلا بك - العربية</span>
        <span className='mx-6'>欢迎 - 中文</span>
        <span className='mx-6'>स्वागत है - हिन्दी</span>
        <span className='mx-6'>Добро пожаловать - Русский</span>
      </div>
    </div>
  );
}
