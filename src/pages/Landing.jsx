import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

// Translations
const translations = {
  fr: {
    'nav.howItWorks': 'Comment Ça Marche',
    'nav.features': 'Fonctionnalités',
    'nav.pricing': 'Tarifs',
    'nav.startTrial': 'Essai Gratuit',
    'hero.badge': 'Code QR • Sans Application',
    'hero.title1': 'Cartes de Fidélité Simples,',
    'hero.title2': 'Zéro Téléchargement.',
    'hero.subtitle': 'Fidelya est un système simple de cartes de fidélité numériques. Les clients scannent un code QR pour accéder instantanément à leur carte—sans téléchargement d\'application, sans friction.',
    'hero.getStarted': 'Commencer',
    'hero.viewDemo': 'Voir la Démo',
    'hero.perfect': 'Parfait pour les cafés, boutiques et entreprises locales',
    'hero.cafes': '☕ Cafés',
    'hero.retail': '🛍️ Commerce',
    'hero.salons': '💇 Salons',
    'hero.restaurants': '🍕 Restaurants',
    'how.title': 'Comment Ça Marche',
    'how.subtitle': 'Trois étapes simples pour lancer votre programme de fidélité numérique.',
    'how.step1.title': 'Créez Votre Carte',
    'how.step1.desc': 'Personnalisez votre carte de fidélité numérique avec les couleurs et le logo de votre marque. Configurez les récompenses que les clients peuvent gagner et échanger.',
    'how.step2.title': 'Le Client Scanne',
    'how.step2.desc': 'Les clients scannent votre code QR et accèdent instantanément à leur carte de fidélité. Pas de téléchargement d\'application, pas de formulaire d\'inscription—juste scanner et c\'est parti.',
    'how.step3.title': 'Suivre et Récompenser',
    'how.step3.desc': 'Votre personnel ajoute des points à la caisse. Les clients vérifient leur solde à tout moment et échangent des récompenses quand ils sont prêts.',
    'stats.title': 'Rejoignez Des Milliers d\'Entreprises',
    'stats.businesses': 'Entreprises Actives',
    'stats.customers': 'Clients Fidèles',
    'stats.points': 'Points Distribués',
    'stats.satisfaction': 'Satisfaction Client',
    'useCases.title': 'Idéal Pour Votre Entreprise',
    'useCases.cafes.title': 'Cafés & Boulangeries',
    'useCases.cafes.desc': 'Récompensez les clients réguliers avec des boissons ou pâtisseries gratuites.',
    'useCases.retail.title': 'Boutiques de Commerce',
    'useCases.retail.desc': 'Créez des programmes de fidélité à plusieurs niveaux avec des avantages exclusifs.',
    'useCases.salons.title': 'Salons & Spas',
    'useCases.salons.desc': 'Offrez des services gratuits après un certain nombre de visites.',
    'useCases.restaurants.title': 'Restaurants',
    'useCases.restaurants.desc': 'Augmentez les visites répétées avec des repas et des réductions gratuits.',
    'pricing.title': 'Tarifs Simples et Transparents',
    'pricing.starter.name': 'Débutant',
    'pricing.starter.price': '29€',
    'pricing.starter.period': '/mois',
    'pricing.starter.desc': 'Parfait pour les petits cafés et boutiques.',
    'pricing.starter.feat1': 'Jusqu\'à 500 Clients',
    'pricing.starter.feat2': 'Génération de Code QR',
    'pricing.starter.feat3': 'Personnalisation',
    'pricing.starter.feat4': 'Support Email',
    'pricing.starter.cta': 'Essai Gratuit',
    'pricing.pro.name': 'Professionnel',
    'pricing.pro.badge': 'Le Plus Populaire',
    'pricing.pro.price': '79€',
    'pricing.pro.period': '/mois',
    'pricing.pro.desc': 'Pour les entreprises multi-sites en croissance.',
    'pricing.pro.feat1': 'Clients Illimités',
    'pricing.pro.feat2': 'Support Multi-Sites',
    'pricing.pro.feat3': 'Recherche de Clients',
    'pricing.pro.feat4': 'Historique des Transactions',
    'pricing.pro.feat5': 'Support Prioritaire',
    'pricing.pro.cta': 'Essai Gratuit',
    'pricing.enterprise.name': 'Entreprise',
    'pricing.enterprise.price': 'Sur Mesure',
    'pricing.enterprise.desc': 'Pour les grandes franchises et chaînes.',
    'pricing.enterprise.feat1': 'Gestionnaire de Compte Dédié',
    'pricing.enterprise.feat2': 'Accès API',
    'pricing.enterprise.feat3': 'Intégration Personnalisée',
    'pricing.enterprise.feat4': 'Garantie SLA',
    'pricing.enterprise.cta': 'Contacter les Ventes',
    'faq.title': 'Questions Fréquentes',
    'faq.q1': 'Comment les clients accèdent-ils à leur carte de fidélité?',
    'faq.a1': 'Les clients scannent simplement votre code QR unique avec l\'appareil photo de leur smartphone. Ils accèdent instantanément à leur carte de fidélité numérique dans leur navigateur—aucun téléchargement d\'application requis.',
    'faq.q2': 'Puis-je personnaliser l\'apparence de la carte?',
    'faq.a2': 'Oui! Vous pouvez personnaliser les couleurs, ajouter votre logo et choisir parmi différents modèles pour que la carte corresponde parfaitement à votre marque.',
    'faq.q3': 'Comment ajouter des points aux clients?',
    'faq.a3': 'Votre personnel peut scanner le code QR du client ou rechercher son nom/téléphone dans le tableau de bord commercial, puis ajouter ou déduire des points manuellement.',
    'faq.q4': 'Fonctionne-t-il pour plusieurs emplacements?',
    'faq.a4': 'Absolument! Le plan Professionnel et Entreprise prend en charge plusieurs emplacements avec des points partagés entre tous vos magasins.',
    'faq.q5': 'Puis-je essayer avant de m\'engager?',
    'faq.a5': 'Oui! Nous offrons un essai gratuit de 14 jours sans carte de crédit requise. Testez toutes les fonctionnalités avant de vous abonner.',
    'faq.q6': 'Les données clients sont-elles sécurisées?',
    'faq.a6': 'Oui. Nous utilisons le cryptage SSL, l\'authentification JWT et suivons les meilleures pratiques de sécurité pour protéger toutes les données des clients et des entreprises.',
    'cta.title': 'Prêt à Commencer?',
    'cta.subtitle': 'Rejoignez des milliers d\'entreprises qui utilisent Fidelya pour fidéliser leurs clients.',
    'cta.button': 'Démarrer l\'Essai Gratuit',
    'footer.tagline': 'Cartes de fidélité numériques simples pour les entreprises modernes.',
    'footer.product': 'Produit',
    'footer.features': 'Fonctionnalités',
    'footer.security': 'Sécurité',
    'footer.enterprise': 'Entreprise',
    'footer.company': 'Société',
    'footer.about': 'À Propos',
    'footer.blog': 'Blog',
    'footer.careers': 'Carrières',
    'footer.legal': 'Légal',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
    'footer.copyright': '© 2025 Fidelya Inc. Tous droits réservés.',
  },
  en: {
    'nav.howItWorks': 'How it Works',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.startTrial': 'Start Free Trial',
    'hero.badge': 'QR-Based • No App Required',
    'hero.title1': 'Simple Loyal Cards,',
    'hero.title2': 'Zero App Downloads.',
    'hero.subtitle': 'Fidelya is a straightforward digital loyalty card system. Customers scan a QR code to access their card instantly—no app download, no friction.',
    'hero.getStarted': 'Get Started',
    'hero.viewDemo': 'View Demo',
    'hero.perfect': 'Perfect for cafes, retail shops, and local businesses',
    'hero.cafes': '☕ Cafes',
    'hero.retail': '🛍️ Retail',
    'hero.salons': '💇 Salons',
    'hero.restaurants': '🍕 Restaurants',
    'how.title': 'How It Works',
    'how.subtitle': 'Three simple steps to launch your digital loyalty program.',
    'how.step1.title': 'Create Your Card',
    'how.step1.desc': 'Customize your digital loyalty card with your brand colors and logo. Set up rewards that customers can earn and redeem.',
    'how.step2.title': 'Customer Scans',
    'how.step2.desc': 'Customers scan your QR code and instantly access their loyalty card. No app download, no signup form—just scan and go.',
    'how.step3.title': 'Track & Reward',
    'how.step3.desc': 'Your staff adds points at checkout. Customers check their balance anytime and redeem rewards when they\'re ready.',
    'stats.title': 'Join Thousands of Businesses',
    'stats.businesses': 'Active Businesses',
    'stats.customers': 'Loyal Customers',
    'stats.points': 'Points Distributed',
    'stats.satisfaction': 'Customer Satisfaction',
    'useCases.title': 'Perfect For Your Business',
    'useCases.cafes.title': 'Cafes & Bakeries',
    'useCases.cafes.desc': 'Reward regular customers with free drinks or pastries.',
    'useCases.retail.title': 'Retail Shops',
    'useCases.retail.desc': 'Create tiered loyalty programs with exclusive member benefits.',
    'useCases.salons.title': 'Salons & Spas',
    'useCases.salons.desc': 'Offer free services after a certain number of visits.',
    'useCases.restaurants.title': 'Restaurants',
    'useCases.restaurants.desc': 'Increase repeat visits with free meals and discounts.',
    'pricing.title': 'Simple, Transparent Pricing',
    'pricing.starter.name': 'Starter',
    'pricing.starter.price': '$29',
    'pricing.starter.period': '/mo',
    'pricing.starter.desc': 'Perfect for small cafes and shops.',
    'pricing.starter.feat1': 'Up to 500 Customers',
    'pricing.starter.feat2': 'QR Code Generation',
    'pricing.starter.feat3': 'Custom Branding',
    'pricing.starter.feat4': 'Email Support',
    'pricing.starter.cta': 'Start Free Trial',
    'pricing.pro.name': 'Professional',
    'pricing.pro.badge': 'Most Popular',
    'pricing.pro.price': '$79',
    'pricing.pro.period': '/mo',
    'pricing.pro.desc': 'For growing multi-location businesses.',
    'pricing.pro.feat1': 'Unlimited Customers',
    'pricing.pro.feat2': 'Multi-Location Support',
    'pricing.pro.feat3': 'Client Search',
    'pricing.pro.feat4': 'Transaction History',
    'pricing.pro.feat5': 'Priority Support',
    'pricing.pro.cta': 'Start Free Trial',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.desc': 'For large franchises & chains.',
    'pricing.enterprise.feat1': 'Dedicated Account Manager',
    'pricing.enterprise.feat2': 'API Access',
    'pricing.enterprise.feat3': 'Custom Integration',
    'pricing.enterprise.feat4': 'SLA Guarantee',
    'pricing.enterprise.cta': 'Contact Sales',
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How do customers access their loyalty card?',
    'faq.a1': 'Customers simply scan your unique QR code with their smartphone camera. They instantly access their digital loyalty card in their browser—no app download required.',
    'faq.q2': 'Can I customize how the card looks?',
    'faq.a2': 'Yes! You can customize colors, add your logo, and choose from different patterns to make the card match your brand perfectly.',
    'faq.q3': 'How do I add points to customers?',
    'faq.a3': 'Your staff can scan the customer\'s QR code or search their name/phone in the business dashboard, then manually add or deduct points.',
    'faq.q4': 'Does it work for multiple locations?',
    'faq.a4': 'Absolutely! The Professional and Enterprise plans support multiple locations with shared points across all your stores.',
    'faq.q5': 'Can I try it before committing?',
    'faq.a5': 'Yes! We offer a 14-day free trial with no credit card required. Test all features before subscribing.',
    'faq.q6': 'Is customer data secure?',
    'faq.a6': 'Yes. We use SSL encryption, JWT authentication, and follow security best practices to protect all customer and business data.',
    'cta.title': 'Ready to Get Started?',
    'cta.subtitle': 'Join thousands of businesses using Fidelya to build customer loyalty.',
    'cta.button': 'Start Free Trial',
    'footer.tagline': 'Simple digital loyalty cards for modern businesses.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.security': 'Security',
    'footer.enterprise': 'Enterprise',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.copyright': '© 2025 Fidelya Inc. All rights reserved.',
  },
  ar: {
    'nav.howItWorks': 'كيف يعمل',
    'nav.features': 'المميزات',
    'nav.pricing': 'الأسعار',
    'nav.startTrial': 'ابدأ تجربة مجانية',
    'hero.badge': 'رمز QR • بدون تطبيق',
    'hero.title1': 'بطاقات ولاء بسيطة،',
    'hero.title2': 'بدون تنزيلات.',
    'hero.subtitle': 'فيديليا هو نظام بطاقات ولاء رقمية بسيط. يقوم العملاء بمسح رمز QR للوصول إلى بطاقتهم على الفور—بدون تنزيل تطبيق، بدون احتكاك.',
    'hero.getStarted': 'ابدأ الآن',
    'hero.viewDemo': 'شاهد العرض',
    'hero.perfect': 'مثالي للمقاهي والمتاجر والشركات المحلية',
    'hero.cafes': '☕ مقاهي',
    'hero.retail': '🛍️ متاجر',
    'hero.salons': '💇 صالونات',
    'hero.restaurants': '🍕 مطاعم',
    'how.title': 'كيف يعمل',
    'how.subtitle': 'ثلاث خطوات بسيطة لإطلاق برنامج الولاء الرقمي الخاص بك.',
    'how.step1.title': 'أنشئ بطاقتك',
    'how.step1.desc': 'خصص بطاقة الولاء الرقمية الخاصة بك بألوان وشعار علامتك التجارية. قم بإعداد المكافآت التي يمكن للعملاء كسبها واستبدالها.',
    'how.step2.title': 'العميل يمسح',
    'how.step2.desc': 'يقوم العملاء بمسح رمز QR الخاص بك ويحصلون على بطاقة الولاء الخاصة بهم على الفور. بدون تنزيل تطبيق، بدون نموذج تسجيل—فقط امسح وانطلق.',
    'how.step3.title': 'تتبع ومكافأة',
    'how.step3.desc': 'يضيف موظفوك النقاط عند الدفع. يتحقق العملاء من رصيدهم في أي وقت ويستبدلون المكافآت عندما يكونون مستعدين.',
    'stats.title': 'انضم إلى آلاف الشركات',
    'stats.businesses': 'الشركات النشطة',
    'stats.customers': 'العملاء المخلصون',
    'stats.points': 'النقاط الموزعة',
    'stats.satisfaction': 'رضا العملاء',
    'useCases.title': 'مثالي لعملك',
    'useCases.cafes.title': 'المقاهي والمخابز',
    'useCases.cafes.desc': 'كافئ العملاء المنتظمين بمشروبات أو معجنات مجانية.',
    'useCases.retail.title': 'متاجر البيع بالتجزئة',
    'useCases.retail.desc': 'أنشئ برامج ولاء متدرجة مع مزايا حصرية للأعضاء.',
    'useCases.salons.title': 'الصالونات والمنتجعات',
    'useCases.salons.desc': 'قدم خدمات مجانية بعد عدد معين من الزيارات.',
    'useCases.restaurants.title': 'المطاعم',
    'useCases.restaurants.desc': 'زد من الزيارات المتكررة مع وجبات وخصومات مجانية.',
    'pricing.title': 'أسعار بسيطة وشفافة',
    'pricing.starter.name': 'المبتدئ',
    'pricing.starter.price': '29$',
    'pricing.starter.period': '/شهر',
    'pricing.starter.desc': 'مثالي للمقاهي والمتاجر الصغيرة.',
    'pricing.starter.feat1': 'حتى 500 عميل',
    'pricing.starter.feat2': 'إنشاء رمز QR',
    'pricing.starter.feat3': 'علامة تجارية مخصصة',
    'pricing.starter.feat4': 'دعم البريد الإلكتروني',
    'pricing.starter.cta': 'تجربة مجانية',
    'pricing.pro.name': 'احترافي',
    'pricing.pro.badge': 'الأكثر شعبية',
    'pricing.pro.price': '79$',
    'pricing.pro.period': '/شهر',
    'pricing.pro.desc': 'للشركات متعددة المواقع المتنامية.',
    'pricing.pro.feat1': 'عملاء غير محدودين',
    'pricing.pro.feat2': 'دعم متعدد المواقع',
    'pricing.pro.feat3': 'بحث العملاء',
    'pricing.pro.feat4': 'سجل المعاملات',
    'pricing.pro.feat5': 'دعم الأولوية',
    'pricing.pro.cta': 'تجربة مجانية',
    'pricing.enterprise.name': 'المؤسسات',
    'pricing.enterprise.price': 'مخصص',
    'pricing.enterprise.desc': 'للامتيازات والسلاسل الكبيرة.',
    'pricing.enterprise.feat1': 'مدير حساب مخصص',
    'pricing.enterprise.feat2': 'وصول API',
    'pricing.enterprise.feat3': 'تكامل مخصص',
    'pricing.enterprise.feat4': 'ضمان SLA',
    'pricing.enterprise.cta': 'اتصل بالمبيعات',
    'faq.title': 'الأسئلة الشائعة',
    'faq.q1': 'كيف يصل العملاء إلى بطاقة الولاء الخاصة بهم؟',
    'faq.a1': 'يقوم العملاء ببساطة بمسح رمز QR الفريد الخاص بك باستخدام كاميرا هواتفهم الذكية. يحصلون على بطاقة الولاء الرقمية الخاصة بهم على الفور في متصفحهم—بدون تنزيل تطبيق.',
    'faq.q2': 'هل يمكنني تخصيص مظهر البطاقة؟',
    'faq.a2': 'نعم! يمكنك تخصيص الألوان وإضافة شعارك واختيار أنماط مختلفة لجعل البطاقة تتناسب مع علامتك التجارية بشكل مثالي.',
    'faq.q3': 'كيف أضيف نقاط للعملاء؟',
    'faq.a3': 'يمكن لموظفيك مسح رمز QR الخاص بالعميل أو البحث عن اسمه/هاتفه في لوحة تحكم الأعمال، ثم إضافة أو خصم النقاط يدويًا.',
    'faq.q4': 'هل يعمل لمواقع متعددة؟',
    'faq.a4': 'بالتأكيد! تدعم الخطط الاحترافية وخطة المؤسسات مواقع متعددة مع نقاط مشتركة عبر جميع متاجرك.',
    'faq.q5': 'هل يمكنني تجربته قبل الالتزام؟',
    'faq.a5': 'نعم! نقدم تجربة مجانية لمدة 14 يومًا بدون الحاجة إلى بطاقة ائتمان. اختبر جميع الميزات قبل الاشتراك.',
    'faq.q6': 'هل بيانات العملاء آمنة؟',
    'faq.a6': 'نعم. نستخدم تشفير SSL ومصادقة JWT ونتبع أفضل ممارسات الأمان لحماية جميع بيانات العملاء والأعمال.',
    'cta.title': 'هل أنت مستعد للبدء؟',
    'cta.subtitle': 'انضم إلى آلاف الشركات التي تستخدم فيديليا لبناء ولاء العملاء.',
    'cta.button': 'ابدأ تجربة مجانية',
    'footer.tagline': 'بطاقات ولاء رقمية بسيطة للشركات الحديثة.',
    'footer.product': 'المنتج',
    'footer.features': 'المميزات',
    'footer.security': 'الأمان',
    'footer.enterprise': 'المؤسسات',
    'footer.company': 'الشركة',
    'footer.about': 'حول',
    'footer.blog': 'مدونة',
    'footer.careers': 'وظائف',
    'footer.legal': 'قانوني',
    'footer.privacy': 'الخصوصية',
    'footer.terms': 'الشروط',
    'footer.copyright': '© 2025 فيديليا. جميع الحقوق محفوظة.',
  },
};

function Landing() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem('fidelya-lang') || 'fr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const canvasRef = useRef(null);

  const t = (key) => translations[lang][key] || key;

  useEffect(() => {
    // Set language attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('fidelya-lang', lang);

    // Canvas animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const stars = [];

    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5;
        this.speed = Math.random() * 0.2 + 0.05;
        this.opacity = Math.random();
      }

      update() {
        this.y -= this.speed;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 150; i++) {
      stars.push(new Star());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      requestAnimationFrame(animate);
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    animate();

    return () => window.removeEventListener('resize', resize);
  }, [lang]);

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} id="warpCanvas"></canvas>

      {/* Navigation */}
      <nav className="navbar">
        <div className="container nav-container">
          <a href="#" className="nav-brand">
            <img src="/F-logo-HD.png" alt="Fidelya" className="brand-logo" />
            <span className="brand-name">Fidelya</span>
          </a>

          <div className="nav-links hidden-mobile">
            <a href="#how-it-works" className="nav-link">{t('nav.howItWorks')}</a>
            <a href="#features" className="nav-link">{t('nav.features')}</a>
            <a href="#pricing" className="nav-link">{t('nav.pricing')}</a>
          </div>

          <div className="nav-actions">
            <div className="lang-switcher">
              <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>FR</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>AR</button>
            </div>

            <button onClick={handleLogin} className="btn btn-primary">{t('nav.startTrial')}</button>
          </div>

          <button
            className={`menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu active">
          <div className="mobile-menu-content">
            <a href="#how-it-works" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.howItWorks')}</a>
            <a href="#features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.features')}</a>
            <a href="#pricing" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.pricing')}</a>
            <button onClick={handleLogin} className="btn btn-primary btn-full mt-4">{t('nav.startTrial')}</button>

            <div className="mobile-lang-switcher mt-4">
              <button className={`lang-btn ${lang === 'fr' ? 'active' : ''}`} onClick={() => setLang('fr')}>FR</button>
              <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`lang-btn ${lang === 'ar' ? 'active' : ''}`} onClick={() => setLang('ar')}>AR</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge-pill fade-in-up">
              <span className="badge-icon">📱</span>
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="hero-title fade-in-up delay-1">
              <span>{t('hero.title1')}</span><br />
              <span className="text-gradient">{t('hero.title2')}</span>
            </h1>

            <p className="hero-subtitle fade-in-up delay-2">{t('hero.subtitle')}</p>

            <div className="hero-cta fade-in-up delay-3">
              <Link to="/login" className="btn btn-primary btn-lg">{t('hero.getStarted')}</Link>
              <a href="#demo" className="btn btn-outline btn-lg">{t('hero.viewDemo')}</a>
            </div>

            <div className="trusted-by fade-in-up delay-4">
              <p>{t('hero.perfect')}</p>
              <div className="logos-row">
                <span className="logo-text">{t('hero.cafes')}</span>
                <span className="logo-text">{t('hero.retail')}</span>
                <span className="logo-text">{t('hero.salons')}</span>
                <span className="logo-text">{t('hero.restaurants')}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: Logo Card */}
          <div className="hero-visual fade-in-right delay-2">
            <div className="device-stack">
              {/* Phone Frame */}
              <div className="phone-frame-realistic">
                <div className="frame-edge"></div>
                <div className="buttons-left">
                  <div className="btn-switch"></div>
                  <div className="btn-vol volume-up"></div>
                  <div className="btn-vol volume-down"></div>
                </div>
                <div className="button-right">
                  <div className="btn-power"></div>
                </div>

                <div className="screen-border">
                  <div className="screen-display">
                    {/* Dynamic Island */}
                    <div className="dynamic-island-area">
                      <div className="island">
                        <div className="cam-lens"></div>
                      </div>
                      <div className="status-bar">
                        <span>9:41</span>
                        <div className="status-icons">
                          <svg width="14" height="10" viewBox="0 0 18 12" fill="currentColor">
                            <path d="M1 9.5h2M5 7.5h2M9 5.5h2M13 3.5h2M17 1.5h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          <div className="bat"></div>
                        </div>
                      </div>
                    </div>

                    {/* App UI */}
                    <div className="app-ui">
                      <div className="app-header">
                        <div className="user-pill">
                          <div className="avatar-sm"></div>
                          <span>Hi, Alex</span>
                        </div>
                        <div className="bell-icon">🔔</div>
                      </div>

                      <div className="balance-card">
                        <div className="card-bg-mesh"></div>
                        <div className="bal-label">Current Balance</div>
                        <div className="bal-amount">2,450 <span>pts</span></div>
                        <div className="bal-bar">
                          <div className="bal-prog" style={{ width: '70%' }}></div>
                        </div>
                        <div className="bal-footer">
                          <span>Platinum Member</span>
                          <span>Next Reward: 3,000</span>
                        </div>
                      </div>

                      <div className="menu-grid">
                        <div className="menu-item">
                          <div className="icon-box">💳</div>
                          <span>Scan</span>
                        </div>
                        <div className="menu-item">
                          <div className="icon-box">🎁</div>
                          <span>Rewards</span>
                        </div>
                        <div className="menu-item">
                          <div className="icon-box">🏷️</div>
                          <span>Offers</span>
                        </div>
                        <div className="menu-item">
                          <div className="icon-box">📍</div>
                          <span>Locator</span>
                        </div>
                      </div>

                      <div className="list-section">
                        <h4>Recent Activity</h4>
                        <div className="list-item">
                          <div className="item-icon">☕</div>
                          <div className="item-text">
                            <div className="row-1">Morning Coffee</div>
                            <div className="row-2">Today, 8:30 AM</div>
                          </div>
                          <div className="item-val positive">+50</div>
                        </div>
                        <div className="list-item">
                          <div className="item-icon">🛍️</div>
                          <div className="item-text">
                            <div className="row-1">Weekly Shop</div>
                            <div className="row-2">Yesterday</div>
                          </div>
                          <div className="item-val positive">+120</div>
                        </div>
                      </div>
                    </div>

                    <div className="home-indicator"></div>
                  </div>
                </div>
              </div>

              {/* The Card - Logo Only */}
              <div className="noble-card">
                <img src="/fidelya.png" alt="Fidelya" className="card-logo-centered" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="brain-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">{t('how.title')}</h2>
            <p className="section-desc">{t('how.subtitle')}</p>
          </div>

          <div className="process-grid">
            <div className="process-card">
              <div className="step-badge">01</div>
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3>{t('how.step1.title')}</h3>
              <p>{t('how.step1.desc')}</p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-card featured">
              <div className="step-badge">02</div>
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
              </div>
              <h3>{t('how.step2.title')}</h3>
              <p>{t('how.step2.desc')}</p>
            </div>

            <div className="process-arrow">→</div>

            <div className="process-card">
              <div className="step-badge">03</div>
              <div className="process-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3>{t('how.step3.title')}</h3>
              <p>{t('how.step3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">{t('stats.title')}</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">{t('stats.businesses')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1.2M+</div>
              <div className="stat-label">{t('stats.customers')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5M+</div>
              <div className="stat-label">{t('stats.points')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">{t('stats.satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="feature-layout">
            <div className="feature-info">
              <h2 className="section-title">Everything You Need</h2>
              <p className="section-desc">Simple tools to run an effective loyalty program without the complexity.</p>

              <ul className="clean-list">
                <li>
                  <div className="list-icon">📱</div>
                  <div>
                    <strong>QR Code Access</strong>
                    <p>Customers scan once and access their card instantly. No app download, no friction.</p>
                  </div>
                </li>
                <li>
                  <div className="list-icon">🎨</div>
                  <div>
                    <strong>Custom Branding</strong>
                    <p>Your logo, your colors, your rewards. The digital card reflects your brand identity.</p>
                  </div>
                </li>
                <li>
                  <div className="list-icon">🏪</div>
                  <div>
                    <strong>Multi-Location Support</strong>
                    <p>Manage multiple stores or locations from a single admin dashboard.</p>
                  </div>
                </li>
                <li>
                  <div className="list-icon">📋</div>
                  <div>
                    <strong>Transaction History</strong>
                    <p>Track every point earned and redeemed with a complete transaction log.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">{t('useCases.title')}</h2>
          <div className="cases-grid">
            <div className="case-card">
              <div className="case-icon">☕</div>
              <h3>{t('useCases.cafes.title')}</h3>
              <p>{t('useCases.cafes.desc')}</p>
            </div>
            <div className="case-card">
              <div className="case-icon">🛍️</div>
              <h3>{t('useCases.retail.title')}</h3>
              <p>{t('useCases.retail.desc')}</p>
            </div>
            <div className="case-card">
              <div className="case-icon">💇</div>
              <h3>{t('useCases.salons.title')}</h3>
              <p>{t('useCases.salons.desc')}</p>
            </div>
            <div className="case-card">
              <div className="case-icon">🍕</div>
              <h3>{t('useCases.restaurants.title')}</h3>
              <p>{t('useCases.restaurants.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <h2 className="section-title text-center">{t('pricing.title')}</h2>
          <div className="pricing-grid">
            <div className="price-plan">
              <h3 className="plan-name">{t('pricing.starter.name')}</h3>
              <div className="plan-price">
                <span>{t('pricing.starter.price')}</span>
                <span>{t('pricing.starter.period')}</span>
              </div>
              <p className="plan-desc">{t('pricing.starter.desc')}</p>
              <ul className="plan-features">
                <li>{t('pricing.starter.feat1')}</li>
                <li>{t('pricing.starter.feat2')}</li>
                <li>{t('pricing.starter.feat3')}</li>
                <li>{t('pricing.starter.feat4')}</li>
              </ul>
              <button onClick={handleLogin} className="btn btn-outline btn-full">{t('pricing.starter.cta')}</button>
            </div>

            <div className="price-plan featured">
              <div className="feature-tag">{t('pricing.pro.badge')}</div>
              <h3 className="plan-name">{t('pricing.pro.name')}</h3>
              <div className="plan-price">
                <span>{t('pricing.pro.price')}</span>
                <span>{t('pricing.pro.period')}</span>
              </div>
              <p className="plan-desc">{t('pricing.pro.desc')}</p>
              <ul className="plan-features">
                <li><strong>{t('pricing.pro.feat1')}</strong></li>
                <li><strong>{t('pricing.pro.feat2')}</strong></li>
                <li>{t('pricing.pro.feat3')}</li>
                <li>{t('pricing.pro.feat4')}</li>
                <li>{t('pricing.pro.feat5')}</li>
              </ul>
              <button onClick={handleLogin} className="btn btn-primary btn-full">{t('pricing.pro.cta')}</button>
            </div>

            <div className="price-plan">
              <h3 className="plan-name">{t('pricing.enterprise.name')}</h3>
              <div className="plan-price">{t('pricing.enterprise.price')}</div>
              <p className="plan-desc">{t('pricing.enterprise.desc')}</p>
              <ul className="plan-features">
                <li>{t('pricing.enterprise.feat1')}</li>
                <li>{t('pricing.enterprise.feat2')}</li>
                <li>{t('pricing.enterprise.feat3')}</li>
                <li>{t('pricing.enterprise.feat4')}</li>
              </ul>
              <a href="#" className="btn btn-outline btn-full">{t('pricing.enterprise.cta')}</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">{t('faq.title')}</h2>
          <div className="faq-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className={`faq-item ${activeFAQ === num ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => setActiveFAQ(activeFAQ === num ? null : num)}>
                  <span>{t(`faq.q${num}`)}</span>
                  <div className="faq-icon">+</div>
                </div>
                <div className="faq-answer">{t(`faq.a${num}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <button onClick={handleLogin} className="btn btn-primary btn-lg">{t('cta.button')}</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="nav-brand mb-4">
                <img src="/F-logo-HD.png" alt="Fidelya" className="brand-logo" />
                <span>Fidelya</span>
              </div>
              <p>{t('footer.tagline')}</p>
            </div>

            <div className="footer-col">
              <h4>{t('footer.product')}</h4>
              <a href="#features">{t('footer.features')}</a>
              <a href="#how-it-works">{t('footer.security')}</a>
              <a href="#pricing">{t('footer.enterprise')}</a>
            </div>

            <div className="footer-col">
              <h4>{t('footer.company')}</h4>
              <a href="#">{t('footer.about')}</a>
              <a href="#">{t('footer.blog')}</a>
              <a href="#">{t('footer.careers')}</a>
            </div>

            <div className="footer-col">
              <h4>{t('footer.legal')}</h4>
              <a href="#">{t('footer.privacy')}</a>
              <a href="#">{t('footer.terms')}</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>{t('footer.copyright')}</p>
            <div className="social-links">
              <a href="#">𝕏</a>
              <a href="#">in</a>
              <a href="#">IG</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
