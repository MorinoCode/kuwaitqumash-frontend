// راهنمای کاربری Qummash در سه زبان.
// تنها منبع دانش دستیار راهنما؛ هیچ اطلاعات محرمانه‌ای (کلید API، رمز، آدرس سرور) در این فایل نیست.

export const HELP_LANGUAGES = ["fa", "en", "ar"];

export const SUPPORT_CONTACT = {
  phone: "",
  whatsapp: "",
};

export const HELP_UI = {
  fa: {
    title: "دستیار راهنما",
    subtitle: "پاسخ از راهنمای سایت، بدون اینترنت",
    quickQuestions: "سؤالات مهم",
    relatedTopics: "موضوعات مرتبط",
    tryAsking: "شاید منظورتان یکی از این‌ها باشد:",
    open: "راهنمای استفاده از سایت",
    placeholder: "سوالت را بنویس، مثلاً: چطور فروش ثبت کنم؟",
    send: "ارسال",
    close: "بستن",
    clear: "گفتگوی جدید",
    greeting:
      "سلام! من دستیار راهنمای قمّاش هستم. هر سؤالی درباره فروش، انبار، ته‌طاقه‌ها، مرجوعی، فاکتور PDF یا چاپ حرارتی 80mm، مشتری، داشبورد و واتساپ داری بپرس؛ به همان زبانی که می‌نویسی جواب می‌دهم.",
    noAnswer:
      "جواب دقیق این سؤال در راهنمای سایت پیدا نشد. لطفاً سؤال را ساده‌تر بنویس یا با پشتیبانی فروشگاه تماس بگیر.",
    suggestions: [
      "چطور فروش ثبت کنم؟",
      "چطور واتساپ را وصل کنم؟",
      "چطور مرجوعی ثبت کنم؟",
      "چطور چاپ حرارتی 80mm بگیرم؟",
      "ته‌طاقه‌ها و اجناس راکد کجاست؟",
    ],
    found: "از راهنما",
    you: "شما",
    bot: "دستیار",
  },
  en: {
    title: "Help assistant",
    subtitle: "Answers from the site guide, fully offline",
    quickQuestions: "Common questions",
    relatedTopics: "Related topics",
    tryAsking: "You might be looking for:",
    open: "How to use the site",
    placeholder: "Type your question, e.g. how do I record a sale?",
    send: "Send",
    close: "Close",
    clear: "New chat",
    greeting:
      "Hi! I am the Qummash help assistant. Ask me anything about sales, inventory, remnants, refunds, PDF or 80mm thermal printing, customers, dashboard, or WhatsApp. I reply in the language you type.",
    noAnswer:
      "That exact answer is not in the site guide. Try simpler keywords or contact store support for help.",
    suggestions: [
      "How do I record a sale?",
      "How do I connect WhatsApp?",
      "How do I refund an invoice?",
      "How do I print an 80mm thermal receipt?",
      "Where are remnants and dead stock?",
    ],
    found: "From the guide",
    you: "You",
    bot: "Assistant",
  },
  ar: {
    title: "مساعد الدليل",
    subtitle: "إجابات من دليل الموقع، بدون إنترنت",
    quickQuestions: "أسئلة مهمة",
    relatedTopics: "مواضيع ذات صلة",
    tryAsking: "ربما تبحث عن أحد هذه المواضيع:",
    open: "طريقة استخدام الموقع",
    placeholder: "اكتب سؤالك، مثال: كيف أسجل عملية بيع؟",
    send: "إرسال",
    close: "إغلاق",
    clear: "محادثة جديدة",
    greeting:
      "مرحبًا! أنا مساعد دليل قمّاش. اسألني عن البيع، المخزون، بقايا الطاقات، المرتجعات، الفاتورة PDF أو الطباعة الحرارية 80mm، العملاء، لوحة التحكم أو واتساب. سأجيب باللغة التي تكتب بها.",
    noAnswer:
      "لم أجد إجابة دقيقة لهذا السؤال في دليل الموقع. جرّب صياغة أبسط أو تواصل مع دعم المتجر.",
    suggestions: [
      "كيف أسجل عملية بيع؟",
      "كيف أربط واتساب؟",
      "كيف أعمل مرتجع؟",
      "كيف أطبع فاتورة حرارية 80mm؟",
      "أين بقايا الطاقات والبضاعة الراكدة؟",
    ],
    found: "من الدليل",
    you: "أنت",
    bot: "المساعد",
  },
};

export const HELP_TOPICS = [
  {
    id: "start-login",
    category: "basic",
    titles: { fa: "ورود به سایت و شناسه فروشگاه (Store ID)", en: "Signing in & Store ID", ar: "تسجيل الدخول ومعرف المتجر (Store ID)" },
    answers: {
      fa: `۱) در صفحه ورود سه فیلد را پر کن: شناسه فروشگاه (Store ID، مثل royal-fabrics)، نام کاربری و رمز عبور، سپس «ورود» را بزن.
۲) شناسه فروشگاه (Store ID) همان نام انگلیسی کوتاه فروشگاه است که هنگام فعال‌سازی فروشگاه از مدیر پلتفرم یا صاحب فروشگاه دریافت کرده‌ای (با حروف کوچک انگلیسی).
۳) سه نقش داریم: صاحب فروشگاه (همه شعبه‌ها و تنظیمات)، مدیر شعبه (شعبه خودش) و فروشنده (فروش و مشتریان شعبه خودش).
۴) بعد از ورود، شعبه فعال را از سوییچ بالای منو انتخاب کن؛ فروش، انبار و آمار روی همان شعبه ثبت می‌شود.
۵) رمز را فراموش کردی؟ صاحب فروشگاه یا مدیر شعبه در «مدیریت ← کارکنان» می‌تواند رمز جدید بگذارد.
۶) پیام «نام کاربری یا رمز اشتباه است» معمولاً به‌خاطر اشتباه بودن Store ID، فاصله اضافه یا فارسی بودن کیبورد است.`,
      en: `1) On the login page fill three fields: Store ID (e.g. royal-fabrics), username and password, then press Sign in.
2) Store ID is the short lowercase English slug assigned when your store was activated (ask your store owner or platform admin if unsure).
3) There are three roles: store owner (all branches and settings), branch manager (their branch) and sales person (sales and customers of their branch only).
4) After signing in pick the active branch from the switch above the menu; sales, inventory and stats follow that branch.
5) Forgot your password? The store owner or a branch manager can set a new one in Manage → Staff.
6) Invalid credentials usually means a typo in Store ID, extra spaces or wrong keyboard language.`,
      ar: `١) في صفحة الدخول املأ الحقول الثلاثة: معرف المتجر (Store ID مثل royal-fabrics)، اسم المستخدم وكلمة المرور ثم اضغط «دخول».
٢) معرف المتجر (Store ID) هو الاسم الإنجليزي المختصر للمتجر عند تفعيله (اسأل صاحب المتجر أو إدارة المنصة إذا نسيته).
٣) توجد ثلاثة أدوار: صاحب المتجر (كل الفروع والإعدادات)، مدير الفرع (فرعه) والمندوب (البيع وعملاء فرعه فقط).
٤) بعد الدخول اختر الفرع النشط من مبدّل الفرع أعلى القائمة؛ تُسجَّل المبيعات والمخزون والإحصاءات على ذلك الفرع.
٥) نسيت كلمة المرور؟ يمكن لصاحب المتجر أو مدير الفرع تعيين كلمة جديدة من «الإدارة ← الموظفون».
٦) رسالة بيانات خاطئة تعني غالبًا خطأ في Store ID أو مسافة زائدة أو لغة لوحة المفاتيح.`,
    },
    keywords: {
      fa: ["ورود", "لاگین", "وارد شدن", "شناسه فروشگاه", "استور آیدی", "رمز عبور", "پسورد", "نام کاربری", "فراموشی رمز", "رمز یادم رفته", "ورود نمی‌کند", "نمی‌توانم وارد شوم", "store id"],
      en: ["login", "sign in", "log in", "store id", "tenant id", "password", "username", "forgot password", "forgot store id", "cannot login"],
      ar: ["دخول", "تسجيل الدخول", "معرف المتجر", "كلمة المرور", "كلمة السر", "اسم المستخدم", "نسيت كلمة المرور", "نسيت كلمة السر", "لا أستطيع الدخول", "store id"],
    },
    related: ["store-registration", "account-security", "staff"],
  },
  {
    id: "store-registration",
    category: "basic",
    titles: { fa: "ساخت اکانت و ثبت فروشگاه جدید", en: "Creating a new store account", ar: "إنشاء حساب وتسجيل متجر جديد" },
    answers: {
      fa: `ثبت‌نام عمومی مستقیم در سایت غیرفعال است تا امنیت و کیفیت فروشگاه‌ها حفظ شود:
• برای راه‌اندازی یک فروشگاه جدید: از صفحه «تماس با ما» (/contact) درخواست خود را با نام، شماره تماس/واتساپ و توضیح کوتاه بفرست؛ تیم پشتیبانی فروشگاه شما را در پنل مدیریت می‌سازد و Store ID + اطلاعات ورود صاحب فروشگاه را تحویل می‌دهد.
• برای ساخت حساب کارمند یا مدیر شعبه در فروشگاه فعلی: نیازی به ثبت‌نام نیست؛ صاحب فروشگاه یا مدیر شعبه از «مدیریت ← کارکنان» حساب کارمند جدید می‌سازد.`,
      en: `Public self-registration is intentionally disabled so every store is verified and configured cleanly:
• To activate a new store: submit your request on the Contact page (/contact) with your name and phone/WhatsApp; the platform admin provisions your store and sends your Store ID and owner login details.
• To add a manager or salesperson to an existing store: no signup is needed — the store owner or branch manager creates staff accounts directly in Manage → Staff.`,
      ar: `التسجيل الذاتي العام معطّل لحماية المتاجر وتفعيلها بشكل منظم:
• لتفعيل متجر جديد: أرسل طلبك عبر صفحة «تواصل معنا» (/contact) مع الاسم ورقم الهاتف/واتساب، وستقوم إدارة المنصة بإنشاء المتجر وإرسال معرف المتجر (Store ID) وبيانات دخول المالك.
• لإضافة مدير فرع أو مندوب داخل متجر قائم: لا حاجة للتسجيل، بل ينشئ صاحب المتجر أو مدير الفرع الحساب من «الإدارة ← الموظفون».`,
    },
    keywords: {
      fa: ["ثبت نام", "ثبت‌نام", "ساخت اکانت", "فروشگاه جدید", "اکانت جدید", "عضویت", "خرید اشتراک", "درخواست فروشگاه", "چطور ثبت نام کنم", "ساخت حساب فروشگاه"],
      en: ["sign up", "signup", "register store", "create account", "new store", "open store", "subscription", "contact admin"],
      ar: ["تسجيل متجر", "إنشاء حساب", "حساب جديد", "متجر جديد", "اشتراك", "طلب متجر", "التسجيل"],
    },
    related: ["start-login", "staff", "branches"],
  },
  {
    id: "language-theme",
    category: "basic",
    titles: { fa: "تغییر زبان و تم (تاریک/روشن)", en: "Language and theme (dark/light)", ar: "اللغة والمظهر (داكن/فاتح)" },
    answers: {
      fa: `دکمه زبان در نوار بالا (FA/EN/AR) را بزن و فارسی، English یا العربية را انتخاب کن؛ تمام منوها، دکمه‌ها، گزارش‌های صفحه و پیام‌ها فوراً تغییر می‌کنند.
• در فارسی و عربی جهت صفحه راست‌چین (RTL) و در انگلیسی چپ‌چین (LTR) می‌شود.
• دکمه خورشید/ماه حالت روشن و تاریک را عوض می‌کند و در مرورگر ذخیره می‌ماند.
• نکته مهم درباره فاکتور چاپی: فاکتور PDF رسمی با استاندارد دوزبانه عربی/انگلیسی کویت تولید می‌شود تا برای همه مشتریان قابل خواندن باشد.`,
      en: `Tap the language button (FA/EN/AR) in the top bar to switch between Farsi, English and Arabic; menus, labels and messages update immediately.
• Farsi and Arabic use right-to-left (RTL) layout; English uses left-to-right (LTR).
• The sun/moon button toggles light and dark mode and remembers your preference in the browser.
• Note on PDF invoices: official PDF invoices use the Kuwait bilingual Arabic/English format so every customer can read them.`,
      ar: `اضغط زر اللغة (FA/EN/AR) في الشريط العلوي للتبديل بين الفارسية والإنجليزية والعربية؛ تتحدث القوائم والرسائل فورًا.
• الفارسية والعربية تجعلان الاتجاه من اليمين إلى اليسار (RTL) والإنجليزية من اليسار إلى اليمين (LTR).
• زر الشمس/القمر يبدل الوضع الفاتح والداكن ويُحفظ في المتصفح.
• ملاحظة حول الفاتورة PDF: تصدر الفاتورة الرسمية بتنسيق ثنائي اللغة (عربي/إنجليزي) وفق معيار الكويت.`,
    },
    keywords: {
      fa: ["زبان", "تغییر زبان", "فارسی", "انگلیسی", "عربی", "تم", "حالت تاریک", "حالت روشن", "دارک مود", "راست چین", "چپ چین"],
      en: ["language", "change language", "english", "arabic", "persian", "theme", "dark mode", "light mode", "rtl"],
      ar: ["اللغة", "تغيير اللغة", "العربية", "الإنجليزية", "الفارسية", "المظهر", "الوضع الداكن", "الوضع الفاتح"],
    },
    related: ["navigation", "invoice-content"],
  },
  {
    id: "navigation",
    category: "basic",
    titles: { fa: "منو و صفحه‌های سایت", en: "Menu and pages", ar: "القائمة والصفحات" },
    answers: {
      fa: `منوی اصلی شامل این بخش‌هاست:
• خانه (Home): میان‌بر سریع به بخش‌های اصلی.
• داشبورد (Dashboard): آمار فروش، سود، نمودارها، مقایسه دوره‌ها، تراز صندوق، عملکرد فروشندگان، ته‌طاقه‌ها و اجناس راکد.
• انبار پارچه (Inventory): لیست طاقه‌ها، افزودن/ویرایش پارچه، آپلود عکس و چاپ برچسب بارکد.
• فروش (Sales): صندوق فروش، اسکنر بارکد، سبد خرید با ذخیره خودکار و ثبت فاکتور.
• فاکتورها (Invoices): فاکتورهای جاری و تب آرشیو (قدیمی)، دانلود PDF، چاپ حرارتی 80mm، ارسال واتساپ، خروجی اکسل و شروع مرجوعی.
• مرجوعی‌ها (Refunds): سابقه رسیدهای مرجوعی (Credit Note) و دانلود PDF.
• مشتریان (Customers): ثبت، جست‌وجو، نوع مشتری و صفحه تحلیل خرید هر مشتری.
• مدیریت (Manage): شعبه‌ها، کارکنان، لوگو، اتصال واتساپ، دریافت کپی فاکتور و پیام گروهی.
با دکمه جمع‌کردن منو فضای صفحه بیشتر می‌شود و در موبایل منو کشویی باز می‌شود.`,
      en: `The main menu includes:
• Home: quick shortcuts to core sections.
• Dashboard: sales, profit, charts, period comparisons, cash drawer breakdown, staff performance, remnants and dead stock.
• Inventory: roll list, add/edit fabrics, images and barcode labels.
• Sales: POS cart with auto-saved drafts, barcode scanner and checkout.
• Invoices: current & archived (old) invoices, PDF, 80mm thermal print, WhatsApp send, Excel export and refunds.
• Refunds: credit note history with PDF download.
• Customers: add, search, customer types and individual purchase analytics.
• Manage: branches, staff, logo, WhatsApp connection, store invoice copy and bulk messaging.
Use the collapse button for more screen space; on phones the menu opens as a drawer.`,
      ar: `تتضمن القائمة الرئيسية:
• الرئيسية: اختصارات سريعة للأقسام الأساسية.
• لوحة التحكم: المبيعات والأرباح والرسوم ومقارنة الفترات وتوازن الصندوق وأداء الموظفين وبقايا الطاقات والبضاعة الراكدة.
• مخزون الأقمشة: قائمة الطاقات، الإضافة والتعديل والصور وملصقات الباركود.
• البيع: سلة البيع مع حفظ تلقائي للمسودة، ماسح الباركود وإصدار الفاتورة.
• الفواتير: الفواتير الحالية وتبويب الفواتير القديمة (الأرشيف)، PDF، الطباعة الحرارية 80mm، واتساب، إكسل والمرتجع.
• المرتجعات: سجل إشعارات الدائن وتنزيل PDF.
• العملاء: الإضافة والبحث وأنواع العملاء وتحليل مشتريات كل عميل.
• الإدارة: الفروع والموظفون والشعار وربط واتساب واستلام نسخة الفاتورة والرسائل الجماعية.
زر الطي يوسّع المساحة، وفي الهاتف تُفتح القائمة كدرج جانبي.`,
    },
    keywords: {
      fa: ["منو", "صفحه‌ها", "کجاست", "کدام صفحه", "بخش", "داشبورد کجاست", "منو کجا رفت", "جمع کردن منو", "تحلیل کجا رفت"],
      en: ["menu", "pages", "where is", "section", "navigation", "sidebar", "collapse menu", "where is analytics"],
      ar: ["القائمة", "الصفحات", "أين", "قسم", "التنقل", "الشريط الجانبي", "أين التحليل"],
    },
    related: ["dashboard", "sales", "inventory-list"],
  },
  {
    id: "dashboard",
    category: "reports",
    titles: { fa: "داشبورد، مخفی کردن سود و تراز صندوق", en: "Dashboard, hiding profit & cash drawer", ar: "لوحة التحكم وإخفاء الربح وتوازن الصندوق" },
    answers: {
      fa: `داشبورد همه آمار و تحلیل‌های فروشگاه را یکجا نشان می‌دهد:
• نمایش/مخفی کردن سود: برای حفظ محرمانگی هنگام حضور مشتری کنار مانیتور، دکمه آیکون چشم (نمایش/مخفی کردن سود) در بالای داشبورد را بزن تا اعداد سود مخفی یا ظاهر شوند.
• تراز صندوق (روش‌های پرداخت): سهم دقیق نقد، K-Net، ویزا/مستر، لینک و چک به همراه تعداد فاکتور و درصد هر روش.
• عملکرد فروشندگان: فروش، سود، مجموع تخفیف، متراژ و تعداد فاکتور هر کارمند.
• ته‌طاقه‌ها و اجناس راکد: تب‌های اختصاصی برای پیگیری پارچه‌های کم‌متراژ و طاقه‌های بدون فروش.
• نقش‌ها: صاحب فروشگاه آمار همه شعبه‌ها و مقایسه آن‌ها را می‌بیند؛ مدیر و فروشنده آمار شعبه/خودشان را می‌بینند.
• خروجی CSV اقلام پرفروش و مقایسه بازه‌های زمانی هم در تب‌های داشبورد قرار دارد.`,
      en: `The Dashboard brings all store KPIs and analytics into one place:
• Show/hide profit: press the eye icon at the top of the dashboard to mask or reveal profit figures when customers are near the screen.
• Cash drawer (payment breakdown): exact totals, invoice counts and percentages for Cash, K-Net, Visa/Master, Link and Cheque.
• Staff performance: revenue, profit, total discounts given, meters sold and invoice counts per salesperson.
• Remnants & dead stock: dedicated tabs to track short roll leftovers and unsold rolls.
• Roles: the owner sees all branches and comparisons; managers and sales staff see their own scope.
• Period comparisons and CSV export of top items are built directly into the dashboard tabs.`,
      ar: `تجمع لوحة التحكم كل المؤشرات والتحليلات في مكان واحد:
• إظهار/إخفاء الربح: اضغط أيقونة العين أعلى لوحة التحكم لإخفاء أرقام الأرباح عند وجود عميل بجانب الشاشة.
• توازن الصندوق (طرق الدفع): إجمالي النقد و K-Net وفيزا/ماستر والرابط والشيك مع عدد الفواتير والنسبة.
• أداء الموظفين: المبيعات والأرباح وإجمالي الخصم والأمتار وعدد الفواتير لكل بائع.
• بقايا الطاقات والبضاعة الراكدة: تبويبات مخصصة لمتابعة الأمتار المتبقية والطاقات غير المباعة.
• الأدوار: صاحب المتجر يرى كل الفروع ومقارنتها، والمدير والمندوب يرون نطاقهم.
• مقارنة الفترات وتصدير CSV للأكثر مبيعًا مدمجة مباشرة في لوحة التحكم.`,
    },
    keywords: {
      fa: ["داشبورد", "آمار", "گزارش فروش", "سود", "مخفی کردن سود", "سودم کجاست", "آیکون چشم", "تراز صندوق", "صندوق شعبه", "عملکرد فروشندگان", "درآمد", "تعداد فاکتور"],
      en: ["dashboard", "stats", "statistics", "profit", "hide profit", "show profit", "eye icon", "cash drawer", "payment breakdown", "staff performance", "revenue"],
      ar: ["لوحة التحكم", "إحصاءات", "أرباح", "إخفاء الربح", "إظهار الربح", "توازن الصندوق", "طرق الدفع", "أداء الموظفين", "الإيرادات"],
    },
    related: ["analytics", "remnants-dead-stock", "reports-export"],
  },
  {
    id: "remnants-dead-stock",
    category: "reports",
    titles: { fa: "ته‌طاقه‌ها و اجناس راکد (بدون فروش)", en: "Remnants and dead stock", ar: "بقايا الطاقات والبضاعة الراكدة" },
    answers: {
      fa: `در داشبورد صاحب فروشگاه و مدیر شعبه، تب اختصاصی «ته‌طاقه‌ها و اجناس راکد» وجود دارد:
• ته‌طاقه‌ها (Remnants): طاقه‌هایی که متراژ باقی‌مانده آن‌ها خیلی کم شده (مثلاً ته‌طاقه‌های کوتاه قابل فروش با تخفیف ویژه).
• اجناس راکد / بدون فروش (Dead Stock): طاقه‌هایی که مدت طولانی در انبار مانده‌اند و فروشی نداشته‌اند، همراه با «تعداد روز ماندگاری» و متراژ موجود.
• کاربرد: با دیدن این دو جدول می‌توانی برای ته‌طاقه‌ها و پارچه‌های خوابیده تخفیف یا کمپین واتساپی بگذاری تا نقدینگی فروشگاه آزاد شود.`,
      en: `Both the Owner and Manager dashboards include a dedicated Remnants & Dead Stock tab:
• Remnants: rolls with very short remaining meters left — ideal for clearance pricing or quick discounts.
• Dead stock: rolls sitting in inventory without recent sales, showing remaining meters and days in stock.
• Tip: review these tables weekly to run discounts or targeted WhatsApp offers and free up cash flow.`,
      ar: `تحتوي لوحة تحكم صاحب المتجر ومدير الفرع على تبويب مخصص لـ«بقايا الطاقات والبضاعة الراكدة»:
• بقايا الطاقات (Remnants): الطاقات التي تبقّى منها عدد قليل من الأمتار — مثالية لعروض التصفية والخصم.
• البضاعة الراكدة (Dead Stock): الطاقات التي بقيت في المخزون مدة طويلة دون مبيعات، مع عرض الأمتار وعدد أيام البقاء.
• نصيحة: راجع الجدولين أسبوعيًا لعمل خصومات أو عروض واتساب وتنشيط السيولة.`,
    },
    keywords: {
      fa: ["ته‌طاقه", "ته طاقه", "ته‌طاقه‌ها", "اجناس راکد", "کالای راکد", "طاقه بدون فروش", "پارچه خوابیده", "ماندگاری", "متراژ باقیمانده", "پارچه فروش نرفته"],
      en: ["remnants", "remnant", "leftover fabric", "dead stock", "unsold rolls", "slow moving", "days in stock"],
      ar: ["بقايا الطاقات", "بقايا القماش", "البضاعة الراكدة", "أقمشة راكدة", "طاقات بدون مبيعات", "أيام البقاء"],
    },
    related: ["dashboard", "stock-alerts", "whatsapp-bulk"],
  },
  {
    id: "analytics",
    category: "reports",
    titles: { fa: "نمودارها و مقایسه دوره‌ها در داشبورد", en: "Charts and period comparisons", ar: "الرسوم البيانية ومقارنة الفترات" },
    answers: {
      fa: `تمام نمودارها و تحلیل‌های زمانی اکنون یکپارچه داخل صفحه «داشبورد» هستند (صفحه تحلیل جداگانه با داشبورد ادغام شده است):
• بازه زمانی: امروز، ۷ روز، ۳۰ روز، ۹۰ روز یا بازه دلخواه با تاریخ شروع و پایان.
• مقایسه دوره‌ها: مقایسه فروش، سود و متراژ با دوره قبل (هفته، ماه، فصل یا سال قبل).
• نمودارها: روند فروش ۷ و ۳۰ روزه، سهم فروش هر شعبه، سهم هر دسته/نوع پارچه، ۵ قلم پرفروش (بر اساس درآمد یا متراژ) و ۵ مشتری برتر.
• صاحب فروشگاه می‌تواند یک یا چند شعبه را انتخاب کند؛ همچنین دکمه دانلود CSV برای لیست کامل اقلام پرفروش وجود دارد.
اگر نمودار خالی است، بازه تاریخ را گسترده‌تر کن یا مطمئن شو شعبه درستی انتخاب شده است.`,
      en: `All charts and time-range analytics are now unified inside the Dashboard (the old separate Analytics route redirects here):
• Date range: today, last 7, 30 or 90 days, or a custom start and end date.
• Period comparison: compare revenue, profit and meters against the previous period, week, month, quarter or year.
• Charts: 7-day and 30-day sales trends, branch share, fabric category & type breakdown, top 5 items (by revenue or quantity) and top 5 customers.
• The owner can filter by multiple branches and export the full top-items table as CSV.
If a chart is empty, widen the date range or verify the selected branch.`,
      ar: `أصبحت كل الرسوم البيانية وتحليلات الفترات مدمجة داخل «لوحة التحكم» (صفحة التحليل القديمة تحوّلك تلقائيًا هنا):
• نطاق التاريخ: اليوم، آخر ٧ أو ٣٠ أو ٩٠ يومًا أو تاريخ بداية ونهاية مخصص.
• مقارنة الفترات: قارن المبيعات والأرباح والأمتار مع الفترة أو الأسبوع أو الشهر أو السنة السابقة.
• الرسوم: اتجاه المبيعات لـ ٧ و ٣٠ يومًا، حصة كل فرع، حصة أنواع الأقمشة، أكثر ٥ أصناف مبيعًا وأفضل ٥ عملاء.
• يمكن لصاحب المتجر اختيار عدة فروع وتصدير جدول الأكثر مبيعًا بصيغة CSV.
إذا كان الرسم فارغًا فوسّع نطاق التاريخ أو تحقق من الفرع المحدد.`,
    },
    keywords: {
      fa: ["تحلیل", "نمودار", "گزارش بازه", "مقایسه دوره", "سود و درآمد", "اقلام پرفروش", "عملکرد شعبه", "آمار دقیق", "CSV", "روند فروش"],
      en: ["analytics", "charts", "period report", "compare period", "revenue profit", "top items", "branch performance", "csv export", "sales trend"],
      ar: ["تحليل", "رسوم بيانية", "تقرير فترة", "مقارنة الفترات", "الإيراد والربح", "الأكثر مبيعًا", "أداء الفروع", "تصدير CSV"],
    },
    related: ["dashboard", "reports-export", "remnants-dead-stock"],
  },
  {
    id: "inventory-list",
    category: "inventory",
    titles: { fa: "جست‌وجو و فیلتر انبار", en: "Searching and filtering inventory", ar: "البحث وتصفية المخزون" },
    answers: {
      fa: `صفحه «انبار پارچه» هر طاقه را با عکس، نام، نوع پارچه، طرح، رنگ، طول، تعداد، قیمت خرید، قیمت فروش، ارزش و سود نشان می‌دهد.
• در کادر جست‌وجو نام قلم، رنگ، طرح یا بارکد را بزن؛ جست‌وجو با بخشی از کلمه هم سریع کار می‌کند.
• فیلتر نوع پارچه، طرح و وضعیت موجودی را از بالای جدول انتخاب کن.
• با کلیک روی سرستون‌ها می‌توانی بر اساس قیمت، طول یا تعداد مرتب کنی.
• روی هر ردیف بزنی صفحه جزئیات همان قلم باز می‌شود.
• رنگ وضعیت، طاقه‌های کم‌موجود و تمام‌شده را مشخص می‌کند.`,
      en: `The Inventory page lists every roll with image, name, fabric type, pattern, colour, length, quantity, cost, selling price, value and profit.
• Type a name, colour, pattern or barcode in the search box; partial matches work fast.
• Filter by fabric type, pattern and stock status above the table.
• Click column headers to sort by price, length or quantity.
• Click any row to open that item's detail page.
• Status colours highlight low-stock and out-of-stock rolls.`,
      ar: `تعرض صفحة المخزون كل طاقة بالصورة والاسم والنوع والنقشة واللون والطول والكمية والتكلفة وسعر البيع والقيمة والربح.
• اكتب الاسم أو اللون أو النقشة أو الباركود في مربع البحث، ويعمل البحث الجزئي بسرعة.
• صفِّ حسب نوع القماش والنقشة وحالة المخزون أعلى الجدول.
• اضغط رأس العمود للترتيب حسب السعر أو الطول أو الكمية.
• اضغط أي صف لفتح تفاصيل الصنف.
• ألوان الحالة تبرز الطاقات القليلة والمنتهية.`,
    },
    keywords: {
      fa: ["انبار", "پارچه", "جست‌وجو", "فیلتر", "موجودی", "طاقه", "لیست پارچه", "مرتب سازی", "پیدا کردن پارچه"],
      en: ["inventory", "fabric list", "search inventory", "filter fabric", "stock", "roll", "sort", "find fabric"],
      ar: ["مخزون", "أقمشة", "بحث", "تصفية", "كمية", "طاقة", "ترتيب", "إيجاد قماش"],
    },
    related: ["inventory-add", "inventory-item", "stock-alerts"],
  },
  {
    id: "inventory-add",
    category: "inventory",
    titles: { fa: "افزودن پارچه جدید، عکس و گزینه‌های سفارشی", en: "Adding a fabric, images & custom options", ar: "إضافة قماش جديد والصور والخيارات المخصصة" },
    answers: {
      fa: `در صفحه «انبار پارچه» دکمه «افزودن پارچه» (یا دکمه + در صفحه فروش) را بزن و فرم را پر کن:
۱) بارکد: با اسکنر بخوان، دستی بزن یا خالی بگذار تا سیستم خودکار بارکد یکتا بسازد؛ بارکد تکراری قبول نمی‌شود.
۲) نام قلم (و نام عربی اختیاری)، نوع پارچه، طرح، رنگ، ترکیب و کشور سازنده — اگر گزینه‌ای در لیست نبود می‌توانی مستقیم همان‌جا تایپ و به‌عنوان گزینه سفارشی ذخیره کنی.
۳) واحد (متر / طاقه / عدد)، طول هر طاقه به متر، عرض به سانتی‌متر و تعداد طاقه.
۴) قیمت خرید هر متر، قیمت فروش هر متر و حداقل موجودی برای هشدار کمبود.
۵) آپلود عکس پارچه (اختیاری) و انتخاب شعبه نگهدارنده.
نکته: مطمئن شو قیمت فروش از قیمت خرید کمتر نباشد تا سود گزارش‌ها دقیق باشد.`,
      en: `On Inventory press Add fabric (or the + button on Sales) and fill the form:
1) Barcode: scan it, type it, or leave blank to auto-generate a unique barcode; duplicates are rejected.
2) Item name (and optional Arabic name), fabric type, pattern, colour, composition and country of origin — if a value is missing you can type and save it as a custom option right away.
3) Unit (meter / roll / piece), roll length in meters, width in cm and roll quantity.
4) Cost per meter, selling price per meter and minimum stock level for alerts.
5) Optional fabric photos and the branch holding the stock.
Tip: keep selling price at or above cost so profit reports stay accurate.`,
      ar: `في المخزون اضغط «إضافة قماش» (أو زر + في صفحة البيع) واملأ النموذج:
١) الباركود: امسحه أو اكتبه أو اتركه فارغًا لتوليد باركود فريد تلقائيًا؛ لا يُقبل المكرر.
٢) اسم الصنف (واسم عربي اختياري)، نوع القماش، النقشة، اللون، التركيب وبلد المنشأ — ويمكنك إضافة خيارات مخصصة جديدة مباشرة.
٣) الوحدة (متر / طاقة / قطعة)، طول الطاقة بالمتر، العرض بالسنتيمتر وعدد الطاقات.
٤) سعر الشراء للمتر وسعر البيع للمتر والحد الأدنى للمخزون.
٥) رفع صور القماش (اختياري) وتحديد الفرع.
ملاحظة: تأكد ألا يقل سعر البيع عن الشراء لتكون تقارير الأرباح دقيقة.`,
    },
    keywords: {
      fa: ["افزودن پارچه", "پارچه جدید", "ثبت پارچه", "اضافه کردن پارچه", "پارچه اضافه کنم", "عکس پارچه", "آپلود عکس", "گزینه سفارشی", "قیمت خرید", "قیمت فروش", "عرض", "طول طاقه", "موجودی اولیه", "بارکد تکراری", "حداقل موجودی"],
      en: ["add fabric", "new fabric", "add item", "create fabric", "fabric image", "upload photo", "custom option", "cost price", "selling price", "width", "roll length", "min stock", "duplicate barcode"],
      ar: ["إضافة قماش", "قماش جديد", "إضافة صنف", "صورة القماش", "رفع صورة", "خيارات مخصصة", "سعر الشراء", "سعر البيع", "العرض", "طول الطاقة", "الحد الأدنى", "باركود مكرر"],
    },
    related: ["inventory-item", "inventory-list", "stock-alerts"],
  },
  {
    id: "inventory-item",
    category: "inventory",
    titles: { fa: "ویرایش، حذف و چاپ برچسب بارکد پارچه", en: "Edit, delete & barcode label", ar: "تعديل وحذف وملصق باركود القماش" },
    answers: {
      fa: `روی هر قلم در انبار کلیک کن تا صفحه جزئیات باز شود:
• «ویرایش»: نام، رنگ، طرح، عکس، قیمت‌ها، طول، تعداد و حداقل موجودی را تغییر بده و ذخیره کن.
• «حذف»: قلم را از انبار پاک می‌کند؛ اگر قبلاً روی فاکتور فروش رفته باشد سیستم برای حفظ سابقه حسابداری اجازه حذف نمی‌دهد و باید موجودی را صفر کنی.
• «چاپ برچسب بارکد»: لیبل بارکد استاندارد برای چسباندن روی طاقه آماده و چاپ می‌کند.
• تغییر قیمت فروش فقط روی فروش‌های آینده اثر دارد و فاکتورهای قبلی را تغییر نمی‌دهد.
• سابقه فروش همان قلم در پایین صفحه قابل مشاهده است.`,
      en: `Click any row in Inventory to open item details:
• Edit: update name, colour, pattern, photos, prices, length, quantity or min stock, then save.
• Delete: removes the item; if it has already been sold on an invoice the system protects accounting history and blocks deletion — set its stock to zero instead.
• Print barcode label: generates a roll label ready for your label printer.
• Updating the selling price affects only future sales, never past invoices.
• The item's sales history appears at the bottom of the page.`,
      ar: `اضغط أي صف في المخزون لفتح تفاصيل الصنف:
• تعديل: غيّر الاسم واللون والنقشة والصور والأسعار والطول والكمية والحد الأدنى ثم احفظ.
• حذف: يزيل الصنف، وإذا ارتبط بفاتورة سابقة يمنع النظام الحذف لحفظ السجل المحاسبي، فاجعل الكمية صفرًا.
• طباعة ملصق باركود: يجهّز ملصق باركود لوضعه على الطاقة.
• تعديل سعر البيع لا يغيّر الفواتير السابقة بل المبيعات القادمة فقط.
• سجل مبيعات الصنف يظهر أسفل الصفحة.`,
    },
    keywords: {
      fa: ["ویرایش پارچه", "حذف پارچه", "تغییر قیمت", "برچسب بارکد", "چاپ بارکد", "لیبل بارکد", "جزئیات قلم", "قیمت را عوض کنم", "پارچه حذف نمی‌شود", "پاک کردن پارچه"],
      en: ["edit fabric", "delete fabric", "change price", "barcode label", "print barcode", "item details", "cannot delete fabric"],
      ar: ["تعديل قماش", "حذف قماش", "تغيير السعر", "ملصق باركود", "طباعة باركود", "تفاصيل الصنف", "لا يمكن حذف القماش"],
    },
    related: ["inventory-add", "stock-alerts", "printing-setup"],
  },
  {
    id: "stock-alerts",
    category: "inventory",
    titles: { fa: "کمبود موجودی، هشدارها و بستن هشدار", en: "Low stock, alerts & dismissing alerts", ar: "نقص المخزون والتنبيهات وإخفاؤها" },
    answers: {
      fa: `برای هر پارچه یک «حداقل موجودی» تعریف می‌شود؛ وقتی موجودی به آن حد برسد، قلم در انبار و پنل «هشدار کمبود موجودی» داشبورد نمایش داده می‌شود.
• بستن موقت هشدار (Dismiss): در داشبورد می‌توانی هشدار یک قلم را ببندی؛ اگر بعداً دوباره شارژ شد و مجدداً زیر حد مجاز آمد، هشدار خودکار دوباره فعال می‌شود.
• وضعیت «تمام‌شده» (Out of Stock) یعنی موجودی صفر است و در فروش قابل انتخاب نیست.
• برای شارژ مجدد، موجودی همان قلم را در صفحه ویرایش افزایش بده و قلم تکراری نساز.
• فروش از موجودی همان شعبه کم می‌شود و مرجوعی خودکار متراژ را به انبار همان شعبه برمی‌گرداند.`,
      en: `Each fabric has a minimum stock threshold; once stock drops to or below it, the item is highlighted in Inventory and listed in the Dashboard low-stock panel.
• Dismissing alerts: you can dismiss an alert from the dashboard; if the roll is later restocked and drops low again, the alert automatically re-arms.
• Out of stock means zero quantity left, so it cannot be added to a sale.
• To restock, increase the quantity on the existing item's edit page rather than creating a duplicate.
• Sales deduct from the active branch's stock, and refunds automatically restore returned meters to that branch.`,
      ar: `لكل قماش حد أدنى للمخزون؛ عند وصول الكمية إليه يظهر الصنف بتنبيه في المخزون وقسم التنبيهات في لوحة التحكم.
• تجاهل التنبيه مؤقتًا: يمكنك إخفاء تنبيه صنف من لوحة التحكم، وإذا أُعيد تزويده ثم نقص مجددًا يتفعّل التنبيه تلقائيًا.
• «منتهي» يعني نفاد الكمية ولا يمكن اختياره في البيع.
• لإعادة التعبئة زد الكمية من تعديل الصنف بدل إنشاء صنف مكرر.
• يخصم البيع من مخزون الفرع النشط، ويعيد المرتجع الأمتار تلقائيًا للفرع نفسه.`,
    },
    keywords: {
      fa: ["کمبود", "حداقل موجودی", "هشدار موجودی", "بستن هشدار", "تمام شده", "موجودی صفر", "پر کردن انبار", "شارژ انبار", "موجودی شعبه"],
      en: ["low stock", "minimum stock", "stock alert", "dismiss alert", "out of stock", "zero stock", "restock", "branch stock"],
      ar: ["نقص المخزون", "الحد الأدنى", "تنبيه المخزون", "إخفاء التنبيه", "منتهي", "كمية صفر", "إعادة التعبئة", "مخزون الفرع"],
    },
    related: ["remnants-dead-stock", "inventory-item", "dashboard"],
  },
  {
    id: "customers-add",
    category: "customers",
    titles: { fa: "افزودن مشتری جدید", en: "Adding a customer", ar: "إضافة عميل جديد" },
    answers: {
      fa: `در صفحه «مشتریان» دکمه «مشتری جدید» را بزن و این فیلدها را پر کن:
• نام کامل، شماره تلفن، جنسیت (مرد/زن) و آدرس.
• نوع مشتری: Regular (عادی)، VIP یا Wholesaler (عمده‌فروش).
• یادداشت اختیاری (سلیقه، اندازه، ساعت مراجعه).
شماره کارت شناسایی یا مدنی لازم نیست و از مشتری گرفته نمی‌شود.
همین فرم از دکمه + کنار جست‌وجوی مشتری در صفحه فروش هم باز می‌شود و بعد از ذخیره مشتری خودکار انتخاب می‌شود.
تلفن را با کد کشور (مثل 965…) بزن تا ارسال فاکتور با واتساپ بدون مشکل کار کند.`,
      en: `On Customers press New customer and fill:
• Full name, phone, gender (male/female) and address.
• Customer type: Regular, VIP or Wholesaler.
• Optional notes (preferences, measurements, preferred visit time).
No civil or national ID is required or collected.
The same form opens from the + button next to customer search on Sales and automatically selects the new customer.
Enter the phone with the country code (e.g. 965…) so WhatsApp invoice delivery works smoothly.`,
      ar: `في صفحة العملاء اضغط «عميل جديد» واملأ:
• الاسم الكامل ورقم الهاتف والجنس (ذكر/أنثى) والعنوان.
• نوع العميل: Regular أو VIP أو Wholesaler (جملة).
• ملاحظات اختيارية (الذوق، المقاسات، وقت الزيارة).
لا يُطلب رقم الهوية أو الرقم المدني.
نفس النموذج يفتح من زر + بجانب بحث العملاء في صفحة البيع ويحدد العميل تلقائيًا.
أدخل الهاتف مع رمز الدولة (مثل 965…) ليعمل إرسال الفاتورة بواتساب بسلاسة.`,
    },
    keywords: {
      fa: ["مشتری جدید", "افزودن مشتری", "اضافه کردن مشتری", "مشتری اضافه کنم", "ثبت مشتری", "شماره تلفن مشتری", "کارت شناسایی مشتری", "آدرس مشتری"],
      en: ["add customer", "new customer", "create customer", "customer phone", "customer id card", "customer address"],
      ar: ["إضافة عميل", "عميل جديد", "تسجيل عميل", "هاتف العميل", "بطاقة العميل", "عنوان العميل"],
    },
    related: ["customers-manage", "customer-types", "sales"],
  },
  {
    id: "customers-manage",
    category: "customers",
    titles: { fa: "مدیریت، سابقه و تحلیل مشتری", en: "Customer history & analytics", ar: "سجل وتحليل العميل" },
    answers: {
      fa: `در لیست مشتریان با نام، تلفن یا آدرس جست‌وجو کن و با دکمه ویرایش اطلاعات را تغییر بده.
• مشتری که فاکتور دارد برای حفظ حسابداری حذف نمی‌شود؛ در صورت نیاز یادداشت بگذار یا نوعش را تغییر بده.
• با کلیک روی هر مشتری صفحه تحلیل او باز می‌شود: مجموع خرید خالص (پس از کسر مرجوعی)، تعداد فاکتور، آخرین مراجعه، الگوی خرید مناسبت‌ها/اعیاد، پارچه و طرح مورد علاقه و لیست فاکتورها با دکمه PDF.
• از همان صفحه می‌توانی فاکتور قبلی را دانلود کنی یا مرجوعی ثبت کنی.`,
      en: `Search Customers by name, phone or address and use Edit to update details.
• A customer with invoices cannot be deleted to preserve accounting records; add a note or change their type instead.
• Clicking a customer opens their analytics page: net spend (after refunds), invoice count, last visit, holiday buying insights, favourite fabric/pattern and full invoice list with PDF buttons.
• You can download past invoices or jump into a refund right from that page.`,
      ar: `ابحث في قائمة العملاء بالاسم أو الهاتف أو العنوان واستخدم «تعديل» لتحديث البيانات.
• لا يمكن حذف عميل لديه فواتير لحماية السجل المحاسبي؛ أضف ملاحظة أو غيّر نوعه.
• الضغط على العميل يفتح صفحة تحليله: صافي المشتريات (بعد المرتجعات)، عدد الفواتير، آخر زيارة، أنماط الشراء في المواسم والأعياد، القماش والنقشة المفضلة وقائمة الفواتير مع PDF.
• من نفس الصفحة يمكن تنزيل فاتورة سابقة أو بدء مرتجع.`,
    },
    keywords: {
      fa: ["لیست مشتریان", "سابقه مشتری", "حذف مشتری", "ویرایش مشتری", "خرید مشتری", "جست‌وجوی مشتری", "تاریخچه خرید", "مشتریارو کجا ببینم", "تحلیل مشتری"],
      en: ["customer list", "customer history", "customer analytics", "delete customer", "edit customer", "customer purchases", "search customer"],
      ar: ["قائمة العملاء", "سجل العميل", "تحليل العميل", "حذف عميل", "تعديل عميل", "مشتريات العميل", "بحث عن عميل"],
    },
    related: ["customers-add", "customer-types", "invoices"],
  },
  {
    id: "customer-types",
    category: "customers",
    titles: { fa: "نوع مشتری و اعمال تخفیف", en: "Customer types & discounts", ar: "أنواع العملاء والخصومات" },
    answers: {
      fa: `نوع مشتری سه حالت دارد و روی فاکتور، گزارش‌ها و فیلتر پیام گروهی واتساپ نمایش داده می‌شود:
• Regular: مشتری عادی فروشگاه.
• VIP: مشتری ویژه (در کمپین واتساپ می‌توانی فقط به VIPها پیام بفرستی).
• Wholesaler: عمده‌فروش.
نحوه اعمال تخفیف: نوع مشتری به‌صورت خودکار تخفیف نمی‌زند؛ در صفحه «فروش»، روی هر ردیف سبد خرید می‌توانی مبلغ تخفیف را مستقیم وارد کنی یا «جمع ردیف» را به مبلغ دلخواه تغییر دهی تا تخفیف خودکار محاسبه شود.`,
      en: `Customer type has three options shown on invoices, reports and WhatsApp bulk segments:
• Regular: standard walk-in customer.
• VIP: priority customer (you can target VIPs specifically in bulk WhatsApp messages).
• Wholesaler: bulk buyer.
Applying discounts: customer type does not auto-discount; in Sales, enter a discount amount per cart row or edit the row's final total directly and the discount calculates automatically.`,
      ar: `لنوع العميل ثلاث فئات تظهر في الفاتورة والتقارير وتصفية رسائل واتساب الجماعية:
• Regular: عميل عادي.
• VIP: عميل مميز (يمكن استهداف عملاء VIP فقط في الرسائل الجماعية).
• Wholesaler: عميل جملة.
طريقة الخصم: النوع لا يخصم تلقائيًا؛ في صفحة «البيع» أدخل مبلغ الخصم في سطر السلة أو عدّل إجمالي السطر مباشرة ليُحسب الخصم تلقائيًا.`,
    },
    keywords: {
      fa: ["نوع مشتری", "وی‌آی‌پی", "عمده فروش", "مشتری عادی", "تخفیف", "چجوری تخفیف بدم", "تخفیف مشتری", "اعمال تخفیف", "Regular", "Wholesaler", "VIP"],
      en: ["customer type", "vip", "wholesaler", "regular customer", "discount", "give discount", "apply discount"],
      ar: ["نوع العميل", "عميل مميز", "جملة", "عميل عادي", "خصم", "كيف أعمل خصم", "خصم العميل"],
    },
    related: ["sales", "customers-add", "whatsapp-bulk"],
  },
  {
    id: "sales",
    category: "sales",
    titles: { fa: "ثبت فروش و سبد خرید", en: "Recording a sale & cart", ar: "تسجيل عملية بيع والسلة" },
    answers: {
      fa: `۱) از منو «فروش» را باز کن و مطمئن شو شعبه فعال درست است.
۲) مشتری را انتخاب کن یا با + مشتری جدید بساز.
۳) پارچه را با نام یا بارکد جست‌وجو کن (یا با اسکنر دوربین/بارکدخوان اسکن کن) تا به سبد اضافه شود.
۴) در هر ردیف متراژ، تعداد طاقه، قیمت هر متر و تخفیف را تنظیم کن؛ اگر جمع نهایی ردیف را تغییر دهی، مبلغ تخفیف خودکار حساب می‌شود.
۵) روش پرداخت (نقد، K-Net، ویزا/مستر، لینک، چک) و مبلغ را وارد کن؛ در پرداخت ترکیبی چند روش اضافه کن تا مانده صفر شود.
۶) «تکمیل فروش» را بزن؛ موجودی طاقه به‌دقت کم می‌شود و پنجره چاپ PDF و ارسال واتساپ باز می‌شود.
نکته: سبد خرید هر شعبه خودکار به‌صورت پیش‌نویس ذخیره می‌شود تا با رفرش صفحه نپرد.`,
      en: `1) Open Sales from the menu and verify the active branch.
2) Pick a customer or create one with +.
3) Search fabric by name or barcode (or scan with camera/barcode reader) to add it to the cart.
4) Set meters, quantity, price per meter and discount per line — editing the line total calculates the discount automatically.
5) Choose payment method(s) (Cash, K-Net, Visa/Master, Link, Cheque) until the remaining balance is zero.
6) Press Complete sale; roll stock deducts accurately and the PDF/WhatsApp preview opens.
Tip: your cart draft is auto-saved per branch so refreshing the page does not lose your work.`,
      ar: `١) افتح «البيع» من القائمة وتأكد من الفرع النشط.
٢) اختر العميل أو أنشئ عميلًا جديدًا بزر +.
٣) ابحث عن القماش بالاسم أو الباركود (أو امسحه بالكاميرا/قارئ الباركود) لإضافته إلى السلة.
٤) حدد الأمتار والكمية وسعر المتر والخصم لكل سطر؛ تعديل إجمالي السطر يحسب الخصم تلقائيًا.
٥) اختر طريقة الدفع (نقدًا، K-Net، فيزا/ماستر، رابط، شيك) حتى يصبح المتبقي صفرًا.
٦) اضغط «إتمام البيع» ليُخصم المخزون بدقة وتُفتح نافذة PDF/واتساب.
ملاحظة: تُحفظ مسودة السلة تلقائيًا لكل فرع حتى لا تضيع عند تحديث الصفحة.`,
    },
    keywords: {
      fa: ["فروش", "ثبت فروش", "فاکتور فروش", "بفروشم", "می‌خواهم بفروشم", "سبد خرید", "اضافه کردن به سبد", "تکمیل فروش", "متراژ", "فروش ثبت نمی‌شود", "برش طاقه"],
      en: ["sale", "sell", "record sale", "cart", "add to cart", "complete sale", "meters", "checkout"],
      ar: ["بيع", "تسجيل بيع", "سلة", "إضافة إلى السلة", "إتمام البيع", "أمتار", "قص القماش"],
    },
    related: ["sales-payments", "sales-draft-barcode", "customer-types"],
  },
  {
    id: "sales-draft-barcode",
    category: "sales",
    titles: { fa: "اسکنر بارکد (دوربین/دستگاه) و ذخیره خودکار سبد", en: "Barcode scanner & auto-saved cart draft", ar: "ماسح الباركود وحفظ السلة تلقائيًا" },
    answers: {
      fa: `در صفحه «فروش» ابزارهای سریع برای سرعت صندوق دارید:
• اسکنر دوربین: روی آیکون اسکنر کنار جست‌وجوی پارچه بزن، اجازه دوربین را بده و بارکد طاقه را جلوی دوربین بگیر تا خودکار به سبد اضافه شود.
• بارکدخوان USB: کافی است نشانگر داخل کادر جست‌وجوی پارچه باشد و بارکد را بزنی.
• افزودن سریع پارچه (+): اگر طاقه‌ای هنوز در انبار ثبت نشده، از دکمه + کنار جست‌وجو همان لحظه ثبتش کن.
• ذخیره خودکار سبد خرید (Draft): مشتری، اقلام سبد و پرداخت‌های واردشده برای هر شعبه جداگانه در مرورگر ذخیره می‌شوند؛ اگر صفحه بسته یا رفرش شود اطلاعات برمی‌گردند و پس از تکمیل فروش پاک می‌شوند.`,
      en: `Sales includes speed tools for the counter:
• Camera scanner: tap the scan icon next to fabric search, allow camera access and point at the roll barcode to add it straight to the cart.
• USB barcode reader: keep focus in the item search input and scan.
• Quick add fabric (+): if a roll is not in inventory yet, create it immediately from the + button without leaving Sales.
• Auto-saved cart drafts: selected customer, cart rows and payments are saved automatically per branch in your browser and cleared once checkout completes.`,
      ar: `توفر صفحة البيع أدوات سريعة للكاشير:
• ماسح الكاميرا: اضغط أيقونة المسح بجانب بحث القماش واسمح بالكاميرا لمسح باركود الطاقة وإضافتها مباشرة للسلة.
• قارئ الباركود USB: ضع المؤشر في حقل البحث وامسح الباركود.
• إضافة قماش سريعة (+): إذا لم يكن الصنف مسجلًا، أضفه فورًا من زر + دون مغادرة صفحة البيع.
• حفظ المسودة تلقائيًا: يُحفظ العميل والسلة والمدفوعات تلقائيًا لكل فرع في المتصفح وتُمسح بعد إتمام البيع.`,
    },
    keywords: {
      fa: ["بارکد", "اسکن بارکد", "اسکنر", "دوربین بارکد", "بارکدخوان", "پیش نویس سبد", "ذخیره خودکار سبد", "سبد خرید نپرد", "اسکن دوربین"],
      en: ["barcode", "barcode scanner", "camera scan", "scan barcode", "cart draft", "auto save cart", "usb scanner"],
      ar: ["باركود", "مسح الباركود", "ماسح الباركود", "كاميرا الباركود", "مسودة السلة", "حفظ السلة تلقائيا"],
    },
    related: ["sales", "inventory-item", "inventory-add"],
  },
  {
    id: "sales-payments",
    category: "sales",
    titles: { fa: "روش‌های پرداخت، پرداخت ترکیبی و مانده", en: "Payment methods, split pay & balance", ar: "طرق الدفع والدفع المقسم والمتبقي" },
    answers: {
      fa: `روش‌های پرداخت پشتیبانی‌شده: نقد (Cash)، K-Net، ویزا/مسترکارت، لینک پرداخت و چک.
• پرداخت ترکیبی (Split Payment): می‌توانی مبلغ یک فاکتور را بین چند روش تقسیم کنی (مثلاً بخشی نقد و بخشی K-Net)؛ سیستم مانده را خودکار محاسبه و تنظیم می‌کند.
• مجموع پرداخت‌ها باید دقیقاً با جمع نهایی فاکتور برابر شود تا دکمه «تکمیل فروش» فعال شود.
• همه مبلغ‌ها به دینار کویت (KWD) با سه رقم اعشار نمایش داده می‌شوند.
• در داشبورد می‌توانی تراز صندوق هر روش پرداخت را جداگانه ببینی.`,
      en: `Supported payment methods: Cash, K-Net, Visa/MasterCard, Payment Link and Cheque.
• Split payments: divide one invoice across multiple methods (e.g. part Cash, part K-Net); remaining amounts auto-adjust as you add or edit rows.
• Total payments must match the grand total before Complete sale activates.
• All amounts use Kuwaiti Dinar (KWD) with three decimal places.
• View each payment method's drawer totals on the Dashboard.`,
      ar: `طرق الدفع المدعومة: نقدًا، K-Net، فيزا/ماستركارت، رابط دفع وشيك.
• الدفع المقسم: يمكنك تقسيم الفاتورة على عدة طرق (مثل جزء نقدًا وجزء K-Net) ويتعدل المتبقي تلقائيًا.
• يجب أن يطابق مجموع المدفوعات إجمالي الفاتورة لتفعيل «إتمام البيع».
• تُعرض المبالغ بالدينار الكويتي (KWD) بثلاث خانات عشرية.
• يمكنك متابعة إجمالي كل طريقة دفع من توازن الصندوق في لوحة التحكم.`,
    },
    keywords: {
      fa: ["پرداخت", "روش پرداخت", "نقد", "کی نت", "K-Net", "ویزا", "مستر", "لینک پرداخت", "چک", "مانده", "پرداخت تقسیمی", "پرداخت ترکیبی", "دینار"],
      en: ["payment method", "cash", "k-net", "visa", "mastercard", "payment link", "cheque", "remaining", "split payment", "kwd"],
      ar: ["طريقة الدفع", "نقدًا", "كي نت", "فيزا", "ماستر", "رابط دفع", "شيك", "المتبقي", "دفع مقسم", "دينار"],
    },
    related: ["sales", "dashboard", "refund"],
  },
  {
    id: "invoices",
    category: "sales",
    titles: { fa: "فاکتورها، PDF، اکسل و حذف/اصلاح فاکتور", en: "Invoices, PDF, Excel & fixing mistakes", ar: "الفواتير و PDF وإكسل وتصحيح الأخطاء" },
    answers: {
      fa: `صفحه «فاکتورها» همه فاکتورهای شعبه را با شماره، تاریخ، مشتری و مبلغ نشان می‌دهد:
• جست‌وجو با شماره فاکتور یا نام مشتری + فیلتر بازه تاریخ و شعبه.
• روی هر فاکتور دکمه‌های «PDF» (فاکتور رسمی A5)، «80mm» (چاپ حرارتی)، «واتساپ» و «مرجوعی» قرار دارد.
• دکمه «خروجی اکسل» گزارش بازه تاریخ انتخابی را به‌صورت فایل Excel دانلود می‌کند.
• تب «فاکتورهای قدیمی» برای آرشیو فاکتورهای قدیمی‌تر است.
• چرا فاکتور حذف یا ویرایش نمی‌شود؟ برای حفظ دقت مالی و حسابداری، فاکتور ثبت‌شده پاک یا ویرایش نمی‌شود؛ برای اصلاح اشتباه، روی همان فاکتور «مرجوعی» (Credit Note) بزن و در صورت نیاز فاکتور جدید درست را ثبت کن.`,
      en: `The Invoices page lists branch invoices with number, date, customer and total:
• Search by invoice number or customer name and filter by date range and branch.
• Each row provides PDF (official A5), 80mm (thermal receipt), WhatsApp send and Refund buttons.
• Export Excel downloads a spreadsheet for your chosen date range and branches.
• Switch to the Old Invoices tab to view archived older invoices.
• Why can't I edit or delete an invoice? Saved invoices are locked for accounting integrity — to fix a mistake, issue a Refund (Credit Note) on that invoice and create the corrected invoice.`,
      ar: `تعرض صفحة الفواتير فواتير الفرع مع الرقم والتاريخ والعميل والمبلغ:
• ابحث برقم الفاتورة أو اسم العميل وصفِّ حسب التاريخ والفرع.
• لكل فاتورة أزرار: PDF (فاتورة رسمية A5)، و 80mm (طباعة حرارية)، وواتساب، ومرتجع.
• زر «تصدير إكسل» ينزل ملف Excel للفترة والفروع المختارة.
• تبويب «الفواتير القديمة» يعرض الأرشيف الأقدم.
• لماذا لا يمكن حذف أو تعديل الفاتورة؟ الفواتير المحفوظة مقفلة لحماية الدقة المحاسبية؛ لتصحيح أي خطأ أصدر «مرتجعًا» (إشعار دائن) ثم سجّل الفاتورة الصحيحة.`,
    },
    keywords: {
      fa: ["فاکتور", "فاکتورها", "PDF", "چاپ فاکتور", "دانلود فاکتور", "حذف فاکتور", "پاک کردن فاکتور", "فاکتورهامو پاک کنم", "ویرایش فاکتور", "اصلاح فاکتور", "فاکتور نمی‌آید"],
      en: ["invoice", "invoices", "pdf", "download invoice", "delete invoice", "edit invoice", "fix invoice", "cancel invoice"],
      ar: ["فاتورة", "فواتير", "PDF", "تنزيل الفاتورة", "حذف الفاتورة", "تعديل الفاتورة", "تصحيح الفاتورة"],
    },
    related: ["thermal-printing", "old-invoices-archive", "refund"],
  },
  {
    id: "thermal-printing",
    category: "sales",
    titles: { fa: "چاپ فیش حرارتی ۸۰ میلی‌متری (Thermal 80mm)", en: "80mm thermal receipt printing", ar: "الطباعة الحرارية 80mm (فیش حراري)" },
    answers: {
      fa: `در صفحه «فاکتورها» (هم در تب فاکتورهای جاری و هم تب فاکتورهای قدیمی)، کنار دکمه PDF دکمه «80mm» وجود دارد:
۱) روی دکمه «80mm» فاکتور موردنظر بزن تا پنجره پیش‌نمایش فیش حرارتی باز شود.
۲) در پنجره چاپ مرورگر، پرینتر حرارتی ۸۰ میلی‌متری را انتخاب کن.
۳) تنظیمات چاپ: مقیاس (Scale) روی ۱۰۰٪، حاشیه (Margins) روی None و گزینه Headers and footers خاموش باشد تا فیش دقیق و بدون فضای اضافه چاپ شود.
۴) اگر پنجره چاپ باز نشد، اجازه Pop-up مرورگر را برای سایت فعال کن.`,
      en: `On the Invoices page (both Current and Archived tabs), tap the 80mm button next to PDF:
1) Click 80mm on the invoice row to open the 80mm thermal receipt print preview.
2) Select your 80mm thermal POS printer in the browser print dialog.
3) Print settings: keep Scale at 100%, set Margins to None, and turn off Headers and footers for a crisp receipt.
4) If the print window does not open, allow browser pop-ups for the site.`,
      ar: `في صفحة الفواتير (في كلٍ من التبويب الحالي والأرشيف)، اضغط زر «80mm» بجانب PDF:
١) اضغط «80mm» على الفاتورة لفتح معاينة الإيصال الحراري.
٢) اختر الطابعة الحرارية 80mm من نافذة طباعة المتصفح.
٣) إعدادات الطباعة: اجعل المقياس ١٠٠٪، والهوامش None، وأطفئ الرؤوس والتذييلات لطباعة متناسقة.
٤) إذا لم تفتح نافذة الطباعة فاسمح بالنوافذ المنبثقة للموقع.`,
    },
    keywords: {
      fa: ["حرارتی", "پرینت حرارتی", "چاپ حرارتی", "فیش حرارتی", "فیش زن", "80mm", "۸۰ میلیمتر", "فیش پرینتر", "رسید حرارتی"],
      en: ["thermal", "thermal print", "thermal receipt", "80mm", "pos printer", "receipt printer"],
      ar: ["حرارية", "طباعة حرارية", "فاتورة حرارية", "إيصال حراري", "80mm", "طابعة حرارية"],
    },
    related: ["printing-setup", "invoices", "invoice-content"],
  },
  {
    id: "old-invoices-archive",
    category: "sales",
    titles: { fa: "فاکتورهای قدیمی و آرشیو", en: "Old & archived invoices", ar: "الفواتير القديمة والأرشيف" },
    answers: {
      fa: `برای سریع ماندن لیست فاکتورهای روزمره، فاکتورهای قدیمی‌تر به‌صورت خودکار در تب «فاکتورهای قدیمی» (آرشیو) قرار می‌گیرند:
• وارد صفحه «فاکتورها» شو و در بالای جدول روی تب «فاکتورهای قدیمی / آرشیو» کلیک کن.
• در این تب می‌توانی شماره فاکتور، تاریخ، مشتری و مبلغ همه فاکتورهای قدیمی را ببینی، با صفحه‌بندی مرور کنی و برای هرکدام «PDF» یا «چاپ حرارتی 80mm» بگیری.
• برای گرفتن فایل اکسل از بازه تاریخ قدیمی، دکمه «خروجی اکسل» را بزن و تاریخ شروع و پایان دلخواه را انتخاب کن.`,
      en: `To keep daily lists fast, older invoices are automatically separated into the Old Invoices (Archive) tab:
• Open Invoices and switch to the Old Invoices tab at the top of the table.
• Browse older invoices with pagination and download PDF or print 80mm thermal receipts anytime.
• To export older date ranges to Excel, press Export Excel and enter your custom start and end dates.`,
      ar: `للحفاظ على سرعة قائمة الفواتير اليومية، تُنقل الفواتير الأقدم تلقائيًا إلى تبويب «الفواتير القديمة» (الأرشيف):
• افتح صفحة «الفواتير» واختر تبويب «الفواتير القديمة» أعلى الجدول.
• يمكنك تصفح الفواتير القديمة وتنزيل PDF أو طباعة 80mm في أي وقت.
• لتصدير فترة قديمة إلى إكسل، اضغط «تصدير إكسل» وحدد تاريخ البداية والنهاية.`,
    },
    keywords: {
      fa: ["فاکتور قدیمی", "فاکتورهای قدیمی", "آرشیو فاکتور", "فاکتور ماه قبل", "فاکتور سال قبل", "آرشیو", "قدیمی کجاست"],
      en: ["old invoices", "archived invoices", "archive", "older invoices", "past invoices"],
      ar: ["الفواتير القديمة", "فاتورة قديمة", "أرشيف الفواتير", "الأرشيف"],
    },
    related: ["invoices", "reports-export", "thermal-printing"],
  },
  {
    id: "invoice-content",
    category: "sales",
    titles: { fa: "محتوای فاکتور چاپی PDF", en: "What the PDF invoice shows", ar: "محتويات الفاتورة PDF" },
    answers: {
      fa: `فاکتور رسمی PDF (قطع A5 دوزبانه عربی/انگلیسی) شامل این موارد است:
• سربرگ فروشگاه با لوگوی شعبه، واترمارک لوگو، نام، آدرس و تلفن.
• شماره فاکتور، تاریخ، ساعت و نام فروشنده.
• نام، تلفن، آدرس و نوع مشتری.
• جدول اقلام: نوع پارچه، طرح، رنگ، متراژ، قیمت هر متر، تخفیف و جمع هر ردیف.
• جمع متراژ، جمع کل به دینار کویت (۳ رقم اعشار) و جزئیات روش‌های پرداخت.
• فرم «الغرض من الشراء»، شرایط و ضوابط پارچه و محل امضای مشتری و فروشنده.
اگر لوگو روی فاکتور نیست، در «مدیریت ← شعبه ← لوگو» آپلود کن تا از فاکتور بعدی نمایش داده شود.`,
      en: `The official A5 bilingual (Arabic/English) PDF invoice contains:
• Store header with branch logo, subtle logo watermark, name, address and phone.
• Invoice number, date, time and salesperson name.
• Customer name, phone, address and type.
• Item table: fabric type, pattern, colour, meters, price per meter, discount and line total.
• Total meters, net amount in KWD (3 decimals) and payment method breakdown.
• The “Purpose of Purchase” KYC section, fabric terms and signature lines.
If no logo appears, upload one in Manage → Branch → Logo for upcoming invoices.`,
      ar: `تتضمن الفاتورة الرسمية PDF (مقاس A5 ثنائي اللغة عربي/إنجليزي):
• ترويسة المتجر مع شعار الفرع وعلامة مائية للشعار والاسم والعنوان والهاتف.
• رقم الفاتورة والتاريخ والوقت واسم البائع.
• اسم العميل وهاتفه وعنوانه ونوعه.
• جدول الأصناف: نوع القماش والنقشة واللون والأمتار وسعر المتر والخصم وإجمالي السطر.
• مجموع الأمتار والصافي بالدينار الكويتي (٣ خانات عشرية) وتفاصيل طرق الدفع.
• نموذج «الغرض من الشراء» وشروط الأقمشة وتوقيع العميل والبائع.
إذا لم يظهر الشعار فارفعه من «الإدارة ← الفرع ← الشعار».`,
    },
    keywords: {
      fa: ["محتوای فاکتور", "لوگو فاکتور", "واترمارک", "سربرگ", "شرایط پارچه", "الغرض من الشراء", "هدف خرید", "سه رقم اعشار", "قطع A5"],
      en: ["invoice content", "invoice logo", "watermark", "header", "fabric terms", "purchase purpose", "decimals", "a5"],
      ar: ["محتويات الفاتورة", "شعار الفاتورة", "علامة مائية", "الترويسة", "شروط القماش", "الغرض من الشراء", "خانات عشرية"],
    },
    related: ["invoices", "branches", "printing-setup"],
  },
  {
    id: "refund",
    category: "refunds",
    titles: { fa: "ثبت مرجوعی (Credit Note)", en: "Creating a refund (Credit Note)", ar: "إنشاء مرتجع (إشعار دائن)" },
    answers: {
      fa: `۱) از منو «مرجوعی‌ها» دکمه مرجوعی جدید یا از صفحه فاکتورها دکمه «مرجوعی» روی همان فاکتور را بزن.
۲) شماره یا شناسه فاکتور را وارد و جست‌وجو کن.
۳) اقلام و متراژ/تعداد برگشتی (مرجوعی کامل یا جزئی) را انتخاب کن.
۴) روش پرداخت برگشت پول (نقد، K-Net، …) و مبلغ را وارد کن؛ جمع پرداخت‌ها باید با مبلغ مرجوعی برابر باشد.
۵) ثبت را بزن؛ «رسید مرجوعی» (Credit Note) با شماره اختصاصی صادر می‌شود.
• موجودی اقلام برگشتی به‌صورت خودکار به انبار همان شعبه برمی‌گردد و در آمار داشبورد کسر می‌شود.
• PDF رسید مرجوعی را از همان صفحه یا صفحه «مرجوعی‌ها» دانلود کن.`,
      en: `1) From Refunds click New refund, or press Refund directly on an invoice row.
2) Search by the original invoice number or ID.
3) Choose full or partial items/meters being returned.
4) Select the refund payout method (Cash, K-Net, …) and amount matching the refund total.
5) Submit to issue an official numbered Credit Note.
• Returned meters/rolls are automatically restored to that branch's inventory and deducted from net dashboard stats.
• Download the Credit Note PDF right away or anytime from the Refunds page.`,
      ar: `١) من «المرتجعات» اضغط مرتجع جديد أو اضغط زر «مرتجع» على الفاتورة مباشرة.
٢) ابحث برقم الفاتورة الأصلية أو معرفها.
٣) حدد الأصناف والأمتار المرتجعة (مرتجع كلي أو جزئي).
٤) اختر طريقة استرداد المبلغ (نقدًا، K-Net، …) بقيمة تساوي إجمالي المرتجع.
٥) اضغط إرسال لإصدار «إشعار دائن» (Credit Note) برقم خاص.
• تُعاد الأمتار تلقائيًا إلى مخزون الفرع وتُخصم من صافي إحصاءات لوحة التحكم.
• نزّل PDF الإشعار فورًا أو من صفحة المرتجعات.`,
    },
    keywords: {
      fa: ["مرجوعی", "مرجوع", "برگشت کالا", "پس دادن", "پس بدم", "کریدیت نوت", "رسید مرجوعی", "لغو فاکتور", "باطل کردن فاکتور", "پول برگشت", "مرجوعی جزئی", "مرجوعی ثبت کنم"],
      en: ["refund", "refunds", "return item", "credit note", "money back", "partial refund", "return fabric"],
      ar: ["مرتجع", "إرجاع", "إشعار دائن", "استرداد المال", "إلغاء فاتورة", "إرجاع قماش", "مرتجع جزئي"],
    },
    related: ["refunds-list", "invoices", "stock-alerts"],
  },
  {
    id: "refunds-list",
    category: "refunds",
    titles: { fa: "لیست و سابقه مرجوعی‌ها", en: "Refund history", ar: "سجل المرتجعات" },
    answers: {
      fa: `صفحه «مرجوعی‌ها» سابقه همه رسیدهای مرجوعی را نشان می‌دهد: شماره Credit Note، شماره فاکتور اصلی، تاریخ، مبلغ، ثبت‌کننده و دکمه دانلود PDF.
• با شماره رسید مرجوعی، شماره فاکتور یا نام مشتری جست‌وجو کن و بازه تاریخ را فیلتر کن.
• صاحب فروشگاه می‌تواند چند شعبه را با هم ببیند؛ مدیر و فروشنده فقط شعبه خودشان را می‌بینند.
• اگر لیست خالی است، فیلتر تاریخ یا شعبه انتخابی را چک کن.`,
      en: `The Refunds page lists all issued credit notes: credit note number, original invoice number, date, amount, staff member and PDF button.
• Search by credit note number, invoice number or customer and filter by date range.
• The owner can filter across branches; managers and sales staff see their own branch.
• If the list looks empty, check the date filter or selected branch.`,
      ar: `تعرض صفحة المرتجعات كل إشعارات الدائن: رقم الإشعار ورقم الفاتورة الأصلية والتاريخ والمبلغ والموظف وزر PDF.
• ابحث برقم الإشعار أو الفاتورة أو العميل وصفِّ حسب التاريخ.
• صاحب المتجر يرى عدة فروع، والمدير والمندوب فرعهم فقط.
• إذا بدت القائمة فارغة فتحقق من تصفية التاريخ أو الفرع.`,
    },
    keywords: {
      fa: ["لیست مرجوعی", "سابقه مرجوعی", "تاریخ مرجوعی", "رسید مرجوعی کجاست", "دانلود کریدیت نوت", "مرجوعی‌ها خالی"],
      en: ["refund list", "refund history", "credit note list", "download credit note", "no refunds"],
      ar: ["قائمة المرتجعات", "سجل المرتجعات", "تنزيل إشعار دائن", "لا مرتجعات"],
    },
    related: ["refund", "invoices"],
  },
  {
    id: "whatsapp-connect",
    category: "whatsapp",
    titles: { fa: "اتصال واتساپ فروشگاه و شعبه", en: "Connecting store & branch WhatsApp", ar: "ربط واتساب المتجر والفرع" },
    answers: {
      fa: `این کار فقط با نقش صاحب فروشگاه انجام می‌شود:
۱) از منو «مدیریت» را باز کن و روی شعبه موردنظر بزن.
۲) تب «اتصال واتساپ» را انتخاب کن و دکمه اتصال را بزن تا کد QR نمایش داده شود.
۳) در گوشی: WhatsApp → Settings → Linked devices → Link a device و کد QR را اسکن کن.
۴) چند ثانیه صبر کن تا وضعیت «متصل» (CONNECTED) و شماره متصل نمایش داده شود.
• شماره مرکزی پشتیبان (Fallback): اگر برای یک شعبه شماره جدا وصل نباشد ولی شماره مرکزی فروشگاه متصل باشد، سیستم خودکار از شماره مرکزی برای ارسال استفاده می‌کند.
• برای عوض کردن شماره، از همان تب دکمه «قطع اتصال» را بزن و شماره جدید را وصل کن.`,
      en: `Only the store owner can link WhatsApp:
1) Open Manage from the menu and select the branch.
2) Open the Connect WhatsApp tab and press Connect to display the QR code.
3) On your phone open WhatsApp → Settings → Linked devices → Link a device and scan the QR.
4) Wait a few seconds until status changes to CONNECTED and shows the linked phone number.
• Central fallback number: if a branch has no dedicated number connected, it can automatically fall back to the store's central connected WhatsApp number.
• To switch numbers, click Disconnect on the same tab and link the new phone.`,
      ar: `هذه الخطوة لصاحب المتجر فقط:
١) افتح «الإدارة» واختر الفرع.
٢) اختر تبويب «ربط واتساب» واضغط اتصال ليظهر رمز QR.
٣) في الهاتف: واتساب → الإعدادات → الأجهزة المرتبطة → ربط جهاز وامسح الرمز.
٤) انتظر ثوانٍ حتى تصبح الحالة «متصل» ويظهر الرقم المرتبط.
• الرقم المركزي الاحتياطي: إذا لم يكن للفرع رقم خاص متصل، يستخدم النظام تلقائيًا الرقم المركزي المتصل للمتجر.
• لتغيير الرقم اضغط «فصل الاتصال» ثم أعد الربط بالرقم الجديد.`,
    },
    keywords: {
      fa: ["واتساپ", "واتس‌اپ", "اتصال واتساپ", "وصل کردن واتساپ", "نصب واتساپ", "اضافه کردن واتساپ", "واتساپ اضافه کنم", "افزودن واتساپ", "واتساپ فروشگاه", "QR", "کیو آر", "اسکن واتساپ", "دستگاه‌های متصل", "قطع واتساپ", "شماره مرکزی واتساپ"],
      en: ["whatsapp", "connect whatsapp", "add whatsapp", "enable whatsapp", "whatsapp setup", "link whatsapp", "store whatsapp", "qr", "scan qr", "linked devices", "disconnect whatsapp", "central number"],
      ar: ["واتساب", "ربط واتساب", "إضافة واتساب", "تفعيل واتساب", "واتساب المتجر", "رمز QR", "مسح الرمز", "الأجهزة المرتبطة", "فصل واتساب", "الرقم المركزي"],
    },
    related: ["whatsapp-send", "whatsapp-store-copy", "whatsapp-troubleshoot"],
  },
  {
    id: "whatsapp-send",
    category: "whatsapp",
    titles: { fa: "فرستادن فاکتور با واتساپ به مشتری", en: "Sending invoices via WhatsApp", ar: "إرسال الفواتير للعميل عبر واتساب" },
    answers: {
      fa: `ابتدا باید واتساپ شعبه (یا شماره مرکزی فروشگاه) متصل باشد:
• پس از تکمیل فروش در پنجره پیش‌نمایش فاکتور، یا از صفحه «فاکتورها» دکمه واتساپ را بزن.
• شماره تلفن مشتری را تأیید یا ویرایش کن (با کد کشور، مثل 965…) و ارسال را بزن.
• فاکتور رسمی PDF مستقیماً به واتساپ مشتری فرستاده می‌شود.
• اگر دکمه واتساپ غیرفعال است، وضعیت اتصال را در «مدیریت ← شعبه ← اتصال واتساپ» بررسی کن.`,
      en: `The branch WhatsApp (or store central number) must be connected first:
• Right after completing a sale, or anytime from the Invoices page, press the WhatsApp button.
• Confirm or edit the customer's phone number (with country code, e.g. 965…) and send.
• The official PDF invoice is delivered straight to the customer on WhatsApp.
• If the WhatsApp button is disabled, check the connection status in Manage → Branch → Connect WhatsApp.`,
      ar: `يجب أن يكون واتساب الفرع (أو الرقم المركزي للمتجر) متصلًا أولًا:
• بعد إتمام البيع مباشرة أو من صفحة «الفواتير» اضغط زر واتساب.
• أكّد رقم هاتف العميل أو عدّله (مع رمز الدولة مثل 965…) واضغط إرسال.
• تُرسل الفاتورة الرسمية PDF مباشرة إلى واتساب العميل.
• إذا كان زر واتساب معطلًا فتحقق من حالة الاتصال في «الإدارة ← الفرع ← ربط واتساب».`,
    },
    keywords: {
      fa: ["ارسال فاکتور", "فاکتور واتساپ", "واتساپ مشتری", "شماره واتساپ", "ارسال pdf واتساپ", "پیام واتساپ", "واتساپ غیرفعال", "فرستادن فاکتور"],
      en: ["send invoice", "invoice whatsapp", "customer whatsapp", "whatsapp number", "send pdf whatsapp", "whatsapp disabled"],
      ar: ["إرسال فاتورة", "فاتورة واتساب", "واتساب العميل", "واتساب للعملاء", "رقم واتساب", "إرسال PDF", "واتساب معطل"],
    },
    related: ["whatsapp-connect", "whatsapp-store-copy", "whatsapp-troubleshoot"],
  },
  {
    id: "whatsapp-store-copy",
    category: "whatsapp",
    titles: { fa: "دریافت خودکار کپی فاکتور روی واتساپ مدیر/فروشگاه", en: "Auto-receiving store copy on WhatsApp", ar: "استلام نسخة الفاتورة تلقائيًا على واتساب المتجر" },
    answers: {
      fa: `اگر می‌خواهی با هر فروش در یک شعبه، نسخه PDF فاکتور خودکار به شماره واتساپ مدیر یا دفتر ارسال شود:
۱) با حساب صاحب فروشگاه وارد «مدیریت ← شعبه موردنظر ← تب دریافت فاکتور» شو.
۲) شماره تلفن مقصد را با کد کشور (مثلاً 96512345678) وارد کن.
۳) تیک «فعال‌سازی دریافت فاکتور برای این شعبه» را بزن و ذخیره کن.
۴) هر زمان نخواستی دیگر کپی برایت بیاید، از همان صفحه دکمه «غیرفعال کردن» (Deactivate) را بزن.`,
      en: `To automatically receive a PDF copy of every new branch invoice on a manager/store WhatsApp number:
1) As store owner open Manage → Branch → Receive Invoices tab.
2) Enter the destination phone number with country code (e.g. 96512345678).
3) Tick “Activate receiving invoices for this branch” and press Save.
4) You can pause or change the number anytime using Deactivate or Save on the same tab.`,
      ar: `لاستلام نسخة PDF من كل فاتورة جديدة تلقائيًا على رقم واتساب الإدارة أو المتجر:
١) بحساب صاحب المتجر افتح «الإدارة ← الفرع ← تبويب استلام الفواتير».
٢) أدخل رقم الهاتف المستلم مع رمز الدولة (مثل 96512345678).
٣) فعّل خيار «تفعيل استلام الفواتير لهذا الفرع» واضغط حفظ.
٤) يمكنك إيقاف الميزة أو تغيير الرقم في أي وقت من نفس التبويب.`,
    },
    keywords: {
      fa: ["دریافت فاکتور واتساپ", "نسخه فروشگاه", "کپی فاکتور", "فاکتور برای مدیر", "واتساپ مدیر", "دریافت خودکار فاکتور"],
      en: ["receive invoice whatsapp", "store copy", "copy of invoice", "owner whatsapp", "auto receive invoice"],
      ar: ["استلام الفاتورة", "نسخة المتجر", "نسخة الفاتورة", "واتساب المدير", "استلام تلقائي"],
    },
    related: ["whatsapp-connect", "whatsapp-send", "branches"],
  },
  {
    id: "whatsapp-bulk",
    category: "whatsapp",
    titles: { fa: "پیام گروهی واتساپ و ضدبلاک خودکار", en: "WhatsApp bulk messages & anti-ban pacing", ar: "رسائل واتساب الجماعية والحماية من الحظر" },
    answers: {
      fa: `فقط صاحب فروشگاه در «مدیریت ← شعبه ← پیام گروهی» می‌تواند پیام همگانی بفرستد:
۱) گروه مخاطبان را انتخاب کن: همه مشتریان، مشتریان پرارزش ۶ ماهه، غیرفعال ۶ ماهه، خرید ۳۰ روز اخیر، خرید ۹۰ روز اخیر یا فقط مشتریان VIP.
۲) در صورت نیاز فیلتر شعبه را انتخاب کن (یا همه شعبه‌ها).
۳) متن پیام را بنویس و ارسال را بزن.
• سیستم ضدبلاک خودکار: صف پس‌زمینه (Worker) به‌طور خودکار بین هر پیام ۲۰ تا ۴۵ ثانیه فاصله می‌گذارد و ارسال را فقط در ساعات کاری کویت (۹ صبح تا ۱۰ شب) انجام می‌دهد تا خطر بلاک شدن شماره به حداقل برسد.`,
      en: `Only the store owner can launch campaigns in Manage → Branch → Bulk messages:
1) Pick a customer segment: all customers, high-value (6m), inactive (6m), purchased in last 30 days, last 90 days, or VIP only.
2) Optionally filter by a specific branch (or all branches).
3) Write your message and click Send.
• Automatic anti-ban pacing: the background worker automatically spaces messages 20–45 seconds apart and sends only during Kuwait working hours (09:00–22:00) to protect your WhatsApp number.`,
      ar: `صاحب المتجر فقط يمكنه الإرسال الجماعي من «الإدارة ← الفرع ← رسائل جماعية»:
١) اختر فئة العملاء: جميع العملاء، ذوو القيمة العالية (٦ أشهر)، غير النشطين (٦ أشهر)، المشترون خلال ٣٠ يومًا أو ٩٠ يومًا، أو عملاء VIP فقط.
٢) اختر فرعًا محددًا (اختياري) أو كل الفروع.
٣) اكتب الرسالة واضغط إرسال.
• حماية تلقائية من الحظر: يطبّق العامل الخلفي فاصلًا زمنيًا تلقائيًا بين ٢٠ إلى ٤٥ ثانية لكل رسالة ويلتزم بساعات العمل في الكويت (٠٩:٠٠ – ٢٢:٠٠) لحماية رقمك.`,
    },
    keywords: {
      fa: ["پیام گروهی", "پیام همگانی", "ارسال گروهی", "تبلیغات واتساپ", "پیام به همه مشتریان", "کمپین واتساپ", "بلاک واتساپ", "bulk"],
      en: ["bulk message", "bulk send", "broadcast", "whatsapp campaign", "message all customers", "anti ban", "segment"],
      ar: ["رسائل جماعية", "إرسال جماعي", "بث", "حملة واتساب", "رسالة لكل العملاء", "حظر واتساب"],
    },
    related: ["whatsapp-connect", "customer-types", "remnants-dead-stock"],
  },
  {
    id: "whatsapp-troubleshoot",
    category: "whatsapp",
    titles: { fa: "رفع مشکل قطع یا وصل نشدن واتساپ", en: "WhatsApp troubleshooting", ar: "حل مشكلات اتصال واتساب" },
    answers: {
      fa: `اگر واتساپ وصل نمی‌شود یا قطع شده است:
• کد QR را با همان گوشی و حساب واتساپ فروشگاه اسکن کن.
• اگر QR منقضی شد، صفحه را رفرش کن و QR جدید بگیر.
• گوشی باید به اینترنت وصل باشد و حالت ذخیره باتری شدید یا حالت هواپیما روشن نباشد.
• اگر بعد از اسکن متصل نشد، دکمه «قطع اتصال» را بزن و یک‌بار از نو وصل کن.
• در گوشی وارد Linked devices شو و دستگاه‌های قدیمی اضافه را حذف کن (واتساپ محدودیت تعداد دستگاه متصل دارد).
• اگر مشکل ادامه داشت به پشتیبانی اطلاع بده.`,
      en: `If WhatsApp fails to connect or keeps disconnecting:
• Scan the QR using the exact phone and WhatsApp account assigned to the store.
• If the QR expires, refresh and request a fresh QR.
• Keep the phone online without airplane mode or aggressive battery saver.
• Click Disconnect and pair again cleanly.
• Open Linked devices on the phone and remove unused old sessions (WhatsApp limits linked devices).
• Contact support if the issue persists.`,
      ar: `إذا لم يتصل واتساب أو انقطع:
• امسح رمز QR من نفس الهاتف وحساب واتساب المخصص للمتجر.
• إذا انتهت صلاحية الرمز فحدّث الصفحة واطلب رمزًا جديدًا.
• تأكد من اتصال الهاتف بالإنترنت وعدم تفعيل وضع الطيران أو موفر البطارية الشديد.
• اضغط «فصل الاتصال» ثم أعد الربط من جديد.
• افتح «الأجهزة المرتبطة» في الهاتف واحذف الأجهزة القديمة غير المستخدمة.
• تواصل مع الدعم إذا استمرت المشكلة.`,
    },
    keywords: {
      fa: ["واتساپ وصل نمی‌شود", "واتساپ قطع شد", "خطای واتساپ", "QR کار نمی‌کند", "واتساپ آنلاین نیست", "قطع مکرر واتساپ", "کد QR منقضی"],
      en: ["whatsapp not connecting", "whatsapp disconnected", "whatsapp error", "qr not working", "whatsapp offline", "keeps disconnecting"],
      ar: ["واتساب لا يتصل", "انقطع واتساب", "خطأ واتساب", "الرمز لا يعمل", "واتساب غير متصل"],
    },
    related: ["whatsapp-connect", "whatsapp-send"],
  },
  {
    id: "reports-export",
    category: "reports",
    titles: { fa: "گرفتن خروجی اکسل، CSV و گزارش‌ها", en: "Excel, CSV exports & reports", ar: "تصدير إكسل و CSV والتقارير" },
    answers: {
      fa: `انواع خروجی‌ها و گزارش‌های سیستم:
• خروجی Excel فاکتورها: در صفحه «فاکتورها» دکمه «خروجی اکسل» را بزن، تاریخ شروع و پایان (و شعبه‌های دلخواه برای مالک) را انتخاب کن و دانلود کن — مناسب حسابداری و مالیات.
• خروجی CSV اقلام پرفروش: در داشبورد صاحب فروشگاه از جدول «اقلام پرفروش» فایل CSV بگیر.
• فاکتور تکی: دکمه PDF یا چاپ حرارتی 80mm روی هر فاکتور.
• رسید مرجوعی: دکمه PDF در صفحه «مرجوعی‌ها».
اگر فایل دانلود نشد، مجوز Pop-up و دانلود مرورگر را چک کن.`,
      en: `Available exports and reports:
• Invoices Excel export: on Invoices click Export Excel, choose your date range (and branches for owner) and download — ideal for accounting.
• Top items CSV: download directly from the Top Items table on the Owner Dashboard.
• Single invoice: PDF or 80mm thermal receipt on each invoice row.
• Credit notes: PDF download on the Refunds page.
If a download is blocked, check browser pop-up and download permissions.`,
      ar: `التقارير والتصديرات المتاحة:
• تصدير الفواتير إلى Excel: من صفحة «الفواتير» اضغط «تصدير إكسل» واختر نطاق التاريخ (والفروع للمالك) — مثالي للمحاسبة.
• تصدير CSV للأكثر مبيعًا: متاح مباشرة من لوحة تحكم صاحب المتجر.
• فاتورة مفردة: زر PDF أو الطباعة الحرارية 80mm.
• إشعارات الدائن: زر PDF في صفحة المرتجعات.
إذا لم يبدأ التنزيل فتحقق من أذونات التنزيل والنوافذ المنبثقة في المتصفح.`,
    },
    keywords: {
      fa: ["خروجی", "خروجی اکسل", "گزارش اکسل", "گزارش بگیرم", "دانلود اکسل", "گزارش", "اکسل", "دانلود گزارش", "گزارش ماهانه", "حسابداری", "export"],
      en: ["export", "export excel", "excel report", "report", "excel", "download report", "monthly report", "accounting", "csv"],
      ar: ["تصدير", "تصدير إكسل", "أصدّر إكسل", "أصدر إكسل", "تقرير إكسل", "تقرير", "إكسل", "تنزيل تقرير", "تقرير شهري", "محاسبة"],
    },
    related: ["invoices", "dashboard", "analytics"],
  },
  {
    id: "staff",
    category: "manage",
    titles: { fa: "کارکنان، نقش‌ها و آمار عملکرد هر کارمند", en: "Staff, roles & staff analytics", ar: "الموظفون والأدوار وتحليل أداء الموظف" },
    answers: {
      fa: `در «مدیریت ← کارکنان» صاحب فروشگاه و مدیر شعبه کاربران را مدیریت می‌کنند:
• ساخت کارمند جدید: نام کامل، نام کاربری (حروف انگلیسی، عدد و _)، رمز حداقل ۶ کاراکتری، نقش و شعبه.
• نقش‌ها: صاحب فروشگاه (دسترسی کامل همه شعبه‌ها)، مدیر شعبه (شعبه خودش) و فروشنده (فروش و مشتریان شعبه خودش).
• هر کارمند باید به یک شعبه متصل باشد.
• با کلیک روی هر کارمند، صفحه جزئیات و آمار عملکرد او (مجموع فروش، متراژ، تخفیف‌ها و فاکتورها) باز می‌شود.
• برای تغییر رمز یک کارمند، همان کاربر را ویرایش کن و رمز جدید بگذار (خالی گذاشتن یعنی رمز تغییر نکند).
• حساب صاحب فروشگاه و حساب خودت قابل حذف نیست.`,
      en: `In Manage → Staff the owner and branch managers manage user accounts:
• Create staff: full name, username (English letters, numbers and _), password (min 6 chars), role and branch.
• Roles: store owner (all branches), branch manager (their branch) and salesperson (sales and customers of their branch).
• Every staff member must be assigned to a branch.
• Click any staff member to view their personal analytics (revenue, meters, discounts and invoices).
• To reset a password, edit that user and enter a new password (leave empty to keep current).
• The owner account and your own active account cannot be deleted.`,
      ar: `في «الإدارة ← الموظفون» يدير صاحب المتجر ومدير الفرع الحسابات:
• إنشاء موظف: الاسم الكامل، اسم المستخدم (حروف إنجليزية وأرقام و _)، كلمة مرور من ٦ أحرف على الأقل، الدور والفرع.
• الأدوار: صاحب المتجر (كل الفروع)، مدير الفرع (فرعه) والمندوب (البيع وعملاء فرعه).
• يجب ربط كل موظف بفرع.
• اضغط على أي موظف لفتح صفحة تحليله (المبيعات والأمتار والخصومات والفواتير).
• لتغيير كلمة المرور عدّل المستخدم وأدخل كلمة جديدة (تركها فارغة يبقيها كما هي).
• لا يمكن حذف حساب صاحب المتجر أو حسابك الحالي.`,
    },
    keywords: {
      fa: ["کارمند", "کارمند جدید", "افزودن کارمند", "اضافه کردن کارمند", "کارمند اضافه کنم", "نقش", "دسترسی", "فروشنده", "مدیر شعبه", "ساخت کاربر", "مجوز", "رمز کارمند", "آمار کارمند"],
      en: ["staff", "employee", "add staff", "role", "permission", "sales person", "branch manager", "create user", "staff password", "staff analytics"],
      ar: ["موظف", "إضافة موظف", "دور", "صلاحيات", "مندوب", "مدير فرع", "إنشاء مستخدم", "كلمة مرور الموظف", "أداء الموظف"],
    },
    related: ["account-security", "branches", "dashboard"],
  },
  {
    id: "branches",
    category: "manage",
    titles: { fa: "شعبه‌ها، آپلود لوگو و شعبه فعال", en: "Branches, logo upload & active branch", ar: "الفروع ورفع الشعار والفرع النشط" },
    answers: {
      fa: `در «مدیریت ← شعبه‌ها» همه شعبه‌های فروشگاه را مدیریت می‌کنی:
• ساخت شعبه جدید: نام (حداقل ۲ حرف)، آدرس و تلفن را وارد کن.
• صفحه هر شعبه ۵ تب دارد: «اطلاعات شعبه»، «دریافت فاکتور واتساپ»، «اتصال واتساپ»، «پیام گروهی» و «لوگو».
• آپلود لوگو: در تب «لوگو» تصویر لوگوی شعبه را آپلود کن تا در سربرگ و واترمارک فاکتور PDF نمایش داده شود.
• شعبه اصلی با نشان HQ مشخص است و حذف نمی‌شود؛ سایر شعبه‌ها فقط وقتی داده وابسته نداشته باشند حذف می‌شوند.
• با سوییچ شعبه در منو، شعبه فعال را عوض کن؛ فروش، انبار و آمار روی همان شعبه اعمال می‌شود.`,
      en: `Manage → Branches controls all store locations:
• New branch: enter name (min 2 chars), address and phone.
• Each branch detail page has 5 tabs: Details, Receive Invoices (WhatsApp), Connect WhatsApp, Bulk Messages and Logo.
• Logo upload: upload your branch logo in the Logo tab so it appears in the PDF invoice header and watermark.
• The main branch is badged HQ and cannot be deleted; other branches can be deleted only when they have no linked data.
• Use the branch switcher in the menu to change your active branch for sales, inventory and stats.`,
      ar: `في «الإدارة ← الفروع» تدير كل فروع المتجر:
• فرع جديد: أدخل الاسم (حرفان على الأقل) والعنوان والهاتف.
• صفحة كل فرع تضم ٥ تبويبات: التفاصيل، استلام الفواتير، ربط واتساب، الرسائل الجماعية والشعار.
• رفع الشعار: ارفع شعار الفرع من تبويب «الشعار» ليظهر في ترويسة وعلامة الفاتورة PDF.
• الفرع الرئيسي يحمل شارة HQ ولا يُحذف، وباقي الفروع تُحذف فقط إذا لم ترتبط بها بيانات.
• استخدم مبدّل الفرع في القائمة لتغيير الفرع النشط للبيع والمخزون والإحصاءات.`,
    },
    keywords: {
      fa: ["شعبه", "شعبه جدید", "افزودن شعبه", "اضافه کردن شعبه", "شعبه اضافه کنم", "لوگو", "لوگو بگذارم", "گذاشتن لوگو", "آپلود لوگو", "تغییر لوگو", "انتخاب شعبه", "آدرس شعبه", "شعبه اصلی", "حذف شعبه"],
      en: ["branch", "new branch", "add branch", "create branch", "logo", "upload logo", "change logo", "switch branch", "branch address", "main branch", "delete branch"],
      ar: ["فرع", "فرع جديد", "إضافة فرع", "شعار", "الشعار", "رفع شعار", "أرفع الشعار", "تغيير الشعار", "اللوغو", "تبديل الفرع", "عنوان الفرع", "الفرع الرئيسي", "حذف فرع"],
    },
    related: ["whatsapp-connect", "whatsapp-store-copy", "invoice-content"],
  },
  {
    id: "printing-setup",
    category: "help",
    titles: { fa: "تنظیمات چاپ فاکتور، حرارتی و برچسب بارکد", en: "Printing invoices, thermal & barcode labels", ar: "إعداد طباعة الفواتير والحراري والباركود" },
    answers: {
      fa: `• فاکتور PDF (قطع A5/A4): در تب جدید باز می‌شود؛ اگر باز نشد Pop-up مرورگر را مجاز کن و هنگام چاپ Scale را روی ۱۰۰٪ بگذار.
• فیش حرارتی 80mm: از دکمه «80mm» روی فاکتور استفاده کن، Margins را روی None و Headers/Footers را خاموش کن.
• برچسب بارکد: از صفحه جزئیات قلم در انبار دکمه چاپ بارکد را بزن و چاپگر لیبل را انتخاب کن.
• اگر متن یا جدول بریده شد، حاشیه چاپ را کم کن یا «Fit to printable area» را انتخاب کن.`,
      en: `• PDF invoice (A5/A4): opens in a new tab; allow browser pop-ups if blocked and keep Scale at 100%.
• 80mm thermal receipt: press the 80mm button on an invoice, set Margins to None and turn off Headers/Footers.
• Barcode labels: open item details in Inventory, click Print Barcode and choose your label printer.
• If edges clip, reduce margins or enable Fit to printable area.`,
      ar: `• فاتورة PDF (A5/A4): تفتح في تبويب جديد؛ اسمح بالنوافذ المنبثقة واجعل المقياس ١٠٠٪.
• طباعة حرارية 80mm: اضغط زر 80mm على الفاتورة واجعل الهوامش None وأطفئ الرؤوس والتذييلات.
• ملصقات الباركود: من تفاصيل الصنف في المخزون اضغط طباعة الباركود واختر طابعة الملصقات.
• إذا انقطع النص فقلل الهوامش أو اختر Fit to printable area.`,
    },
    keywords: {
      fa: ["چاپ", "چاپگر", "پرینتر", "پاپ آپ", "PDF باز نمی‌شود", "برچسب چاپ", "کاغذ A4", "کاغذ A5", "متن بریده می‌شود"],
      en: ["print", "printer", "pop-up", "pdf not opening", "print label", "a4", "a5", "text cut off"],
      ar: ["طباعة", "طابعة", "نافذة منبثقة", "PDF لا يفتح", "طباعة ملصق", "A4", "A5", "النص مقطوع"],
    },
    related: ["thermal-printing", "invoices", "inventory-item"],
  },
  {
    id: "daily-checklist",
    category: "help",
    titles: { fa: "روتین روزانه فروشگاه", en: "Daily store routine", ar: "روتين المتجر اليومي" },
    answers: {
      fa: `شروع روز:
• شعبه فعال را چک کن و از متصل بودن واتساپ شعبه مطمئن شو.
• هشدار کمبود موجودی و ته‌طاقه‌ها را در داشبورد ببین.
در طول روز:
• هر فروش را همان لحظه ثبت کن و شماره مشتری را با کد کشور (965…) وارد کن.
• مرجوعی را همیشه از روی فاکتور اصلی ثبت کن تا انبار و صندوق دقیق بماند.
پایان روز:
• تراز صندوق داشبورد (نقد، K-Net، ویزا، لینک، چک) را با دستگاه کارت‌خوان و صندوق فیزیکی تطبیق بده.
• خروجی اکسل روز را از صفحه فاکتورها ذخیره کن.`,
      en: `Start of day:
• Verify the active branch and confirm WhatsApp is connected.
• Check low-stock alerts and remnants on the Dashboard.
During the day:
• Record every sale immediately and save customer phones with country code (965…).
• Always process refunds from the original invoice so stock and balances stay exact.
End of day:
• Reconcile the Dashboard payment breakdown (Cash, K-Net, Visa, Link, Cheque) with your POS terminal and cash drawer.
• Export today's Excel report from Invoices.`,
      ar: `بداية اليوم:
• تحقق من الفرع النشط واتصال واتساب الفرع.
• راجع تنبيهات نقص المخزون وبقايا الطاقات في لوحة التحكم.
خلال اليوم:
• سجّل كل عملية بيع فورًا وأدخل هاتف العميل مع رمز الدولة (965…).
• سجّل أي مرتجع من الفاتورة الأصلية ليبقى المخزون والصندوق دقيقين.
نهاية اليوم:
• طابق توازن الصندوق في لوحة التحكم (نقد، K-Net، فيزا، رابط، شيك) مع جهاز الدفع والصندوق الفعلي.
• صدّر تقرير إكسل لليوم من صفحة الفواتير.`,
    },
    keywords: {
      fa: ["روتین", "کارهای روزانه", "پایان روز", "بستن صندوق", "بستن روز", "چک لیست روزانه", "تطبیق صندوق"],
      en: ["routine", "daily tasks", "end of day", "closing", "reconcile drawer", "checklist"],
      ar: ["روتين", "مهام يومية", "نهاية اليوم", "إغلاق الصندوق", "إغلاق اليوم", "قائمة تحقق"],
    },
    related: ["dashboard", "reports-export", "sales-payments"],
  },
  {
    id: "account-security",
    category: "help",
    titles: { fa: "امنیت حساب، خروج و مدیریت دسترسی", en: "Account security & logout", ar: "أمان الحساب وتسجيل الخروج" },
    answers: {
      fa: `• برای هر کارمند حساب جدا بساز و رمز را با دیگران شریک نشو.
• رمز حساب صاحب فروشگاه را محرمانه نگه دار؛ فروش روزمره با حساب فروشنده یا مدیر انجام شود.
• هنگام حضور مشتری کنار مانیتور، آیکون چشم در داشبورد را بزن تا اعداد سود مخفی شوند.
• روی سیستم مشترک پس از پایان شیفت حتماً «خروج» (Logout) بزن.
• اگر کارمندی فروشگاه را ترک کرد، فوری از «مدیریت ← کارکنان» حسابش را حذف یا رمزش را عوض کن (دسترسی او بلافاصله قطع می‌شود).
• پشتیبانی هرگز رمز عبور شما را نمی‌پرسد.`,
      en: `• Give every employee their own account and never share passwords.
• Keep the owner password private; use manager or sales accounts for daily counter work.
• Use the eye icon on the Dashboard to hide profit numbers when customers are near the monitor.
• Always Sign out when finishing a shift on a shared device.
• When an employee leaves, immediately delete their account or change their password in Manage → Staff (sessions invalidate right away).
• Support will never ask for your password.`,
      ar: `• أنشئ حسابًا مستقلًا لكل موظف ولا تشارك كلمات المرور.
• احتفظ بكلمة مرور صاحب المتجر سرية واستخدم حسابات المدير أو المندوب للعمل اليومي.
• استخدم أيقونة العين في لوحة التحكم لإخفاء الأرباح عند وجود عملاء قرب الشاشة.
• سجّل الخروج دائمًا بعد انتهاء الوردية على الأجهزة المشتركة.
• عند مغادرة موظف احذف حسابه فورًا أو غيّر كلمة مروره من «الإدارة ← الموظفون» ليُوقف دخوله مباشرة.
• الدعم لا يطلب كلمة المرور أبدًا.`,
    },
    keywords: {
      fa: ["امنیت", "رمز", "خروج از حساب", "لاگ اوت", "اشتراک رمز", "کاربر حذف", "دسترسی کارمند", "قطع دسترسی"],
      en: ["security", "password", "logout", "sign out", "share password", "remove user", "staff access"],
      ar: ["أمان", "تسجيل الخروج", "مشاركة كلمة المرور", "حذف مستخدم", "صلاحيات الموظف"],
    },
    related: ["staff", "start-login", "dashboard"],
  },
  {
    id: "troubleshooting",
    category: "help",
    titles: { fa: "رفع مشکل‌های رایج و خطاها", en: "Common problems & errors", ar: "حل المشكلات والأخطاء الشائعة" },
    answers: {
      fa: `• صفحه سفید یا خطای ناگهانی: صفحه را رفرش کن و دوباره از منو باز کن؛ اگر تکرار شد به پشتیبانی اطلاع بده.
• کندی: تب‌های اضافی مرورگر را ببند و یک‌بار صفحه را رفرش کن.
• PDF یا چاپ 80mm باز نمی‌شود: اجازه Pop-up مرورگر را برای سایت فعال کن یا از صفحه «فاکتورها» دوباره امتحان کن.
• اعداد یا تاریخ اشتباه است: بازه تاریخ و «شعبه فعال» بالای منو را چک کن.
• خطای «دسترسی ندارید» (403): نقش فعلی شما اجازه دسترسی به این بخش را ندارد؛ با حساب مناسب وارد شو.
• فرم ذخیره نمی‌شود: فیلدهای اجباری و پیام خطای قرمز بالای فرم را بررسی کن.`,
      en: `• Blank screen or unexpected error: refresh and reopen from the menu; contact support if it persists.
• Slowness: close unused browser tabs and refresh.
• PDF or 80mm print does not open: allow pop-ups for the site or retry from the Invoices page.
• Wrong numbers or dates: check the selected date range and active branch at the top of the menu.
• Access denied (403): your current role does not have permission for that page; sign in with an authorized account.
• Form not saving: check required fields and the validation error banner at the top of the form.`,
      ar: `• صفحة بيضاء أو خطأ مفاجئ: حدّث الصفحة وأعد فتحها من القائمة، وأبلغ الدعم إن تكررت.
• البطء: أغلق التبويبات الزائدة وحدّث الصفحة.
• PDF أو طباعة 80mm لا تفتح: اسمح بالنوافذ المنبثقة أو أعد المحاولة من صفحة الفواتير.
• أرقام أو تواريخ خاطئة: تحقق من نطاق التاريخ والفرع النشط أعلى القائمة.
• «لا تملك صلاحية» (403): دورك الحالي لا يسمح بهذه الصفحة؛ ادخل بحساب مناسب.
• النموذج لا يُحفظ: تحقق من الحقول المطلوبة ورسالة الخطأ أعلى النموذج.`,
    },
    keywords: {
      fa: ["مشکل", "خطا", "ارور", "صفحه سفید", "کار نمی‌کند", "باگ", "کندی", "دسترسی ندارید", "ذخیره نمی‌شود", "403", "500"],
      en: ["problem", "error", "white page", "blank page", "not working", "bug", "slow", "access denied", "not saving", "403", "500"],
      ar: ["مشكلة", "خطأ", "صفحة بيضاء", "لا يعمل", "بطيء", "لا تملك صلاحية", "لا يتم الحفظ", "403", "500"],
    },
    related: ["whatsapp-troubleshoot", "printing-setup", "start-login"],
  },
];
