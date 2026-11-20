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
    open: "راهنمای استفاده از سایت",
    placeholder: "سوالت را بنویس، مثلاً: چطور فروش ثبت کنم؟",
    send: "ارسال",
    close: "بستن",
    clear: "گفتگوی جدید",
    greeting:
      "سلام! من دستیار راهنمای قمّاش هستم. هر سؤالی درباره فروش، انبار، مرجوعی، مشتری، فاکتور و اتصال واتساپ داری بپرس؛ به همان زبانی که می‌نویسی جواب می‌دهم.",
    noAnswer:
      "جواب این سؤال در راهنمای سایت نیست. لطفاً با پشتیبانی فروشگاه تماس بگیرید تا کمکت کنند.",
    suggestions: [
      "چطور فروش ثبت کنم؟",
      "چطور واتساپ را وصل کنم؟",
      "چطور مرجوعی ثبت کنم؟",
      "چطور مشتری جدید اضافه کنم؟",
      "چطور فاکتور PDF بگیرم؟",
    ],
    found: "از راهنما",
    you: "شما",
    bot: "دستیار",
  },
  en: {
    title: "Help assistant",
    subtitle: "Answers from the site guide, fully offline",
    quickQuestions: "Common questions",
    open: "How to use the site",
    placeholder: "Type your question, e.g. how do I record a sale?",
    send: "Send",
    close: "Close",
    clear: "New chat",
    greeting:
      "Hi! I am the Qummash help assistant. Ask me anything about sales, inventory, refunds, customers, invoices or connecting WhatsApp. I reply in the language you type.",
    noAnswer:
      "That answer is not in the site guide. Please contact store support so a person can help you.",
    suggestions: [
      "How do I record a sale?",
      "How do I connect WhatsApp?",
      "How do I refund an invoice?",
      "How do I add a customer?",
      "How do I get the invoice PDF?",
    ],
    found: "From the guide",
    you: "You",
    bot: "Assistant",
  },
  ar: {
    title: "مساعد الدليل",
    subtitle: "إجابات من دليل الموقع، بدون إنترنت",
    quickQuestions: "أسئلة مهمة",
    open: "طريقة استخدام الموقع",
    placeholder: "اكتب سؤالك، مثال: كيف أسجل عملية بيع؟",
    send: "إرسال",
    close: "إغلاق",
    clear: "محادثة جديدة",
    greeting:
      "مرحبًا! أنا مساعد دليل قمّاش. اسألني عن البيع، المخزون، المرتجعات، العملاء، الفواتير أو ربط واتساب. سأجيب باللغة التي تكتب بها.",
    noAnswer:
      "هذه الإجابة غير موجودة في دليل الموقع. يُرجى التواصل مع دعم المتجر لمساعدتك.",
    suggestions: [
      "كيف أسجل عملية بيع؟",
      "كيف أربط واتساب؟",
      "كيف أعمل مرتجع؟",
      "كيف أضيف عميلًا جديدًا؟",
      "كيف أحصل على الفاتورة PDF؟",
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
    titles: { fa: "ورود به سایت", en: "Signing in", ar: "تسجيل الدخول" },
    answers: {
      fa: `۱) نام کاربری و رمزی که صاحب فروشگاه برایت ساخته را در صفحه ورود بزن و «ورود» را بزن.
۲) سه نقش داریم: صاحب فروشگاه (همه شعبه‌ها و تنظیمات)، مدیر شعبه (شعبه خودش) و فروشنده (فقط فروش و مشتریان شعبه خودش).
۳) بعد از ورود، شعبه فعال را از سوییچ بالای منو انتخاب کن؛ فروش و آمار روی همان شعبه ثبت می‌شود.
۴) رمز را فراموش کردی؟ صاحب فروشگاه یا مدیر شعبه در «مدیریت ← کارکنان» می‌تواند رمز جدید بگذارد.
۵) پیام «نام کاربری یا رمز اشتباه است» یعنی حروف بزرگ/کوچک، فاصله اضافه یا زبان کیبورد را اشتباه زده‌ای.
نکته: برای هر کارمند حساب جدا بساز تا معلوم باشد هر فروش را چه کسی ثبت کرده.`,
      en: `1) Enter the username and password the store owner created for you and press Sign in.
2) There are three roles: store owner (all branches and settings), branch manager (their branch) and sales person (sales and customers of their branch only).
3) After signing in pick the active branch from the switch above the menu; sales and stats are recorded for that branch.
4) Forgot the password? The store owner or a branch manager can set a new one in Manage → Staff.
5) A wrong username or password message means a case, extra space or keyboard language mismatch.
Tip: give every staff member their own account so each sale is traceable.`,
      ar: `١) أدخل اسم المستخدم وكلمة المرور التي أنشأها صاحب المتجر واضغط «دخول».
٢) توجد ثلاثة أدوار: صاحب المتجر (كل الفروع والإعدادات)، مدير الفرع (فرعه) والمندوب (البيع وعملاء فرعه فقط).
٣) بعد الدخول اختر الفرع النشط من مبدّل الفرع أعلى القائمة؛ تُسجَّل المبيعات والإحصاءات على ذلك الفرع.
٤) نسيت كلمة المرور؟ يمكن لصاحب المتجر أو مدير الفرع تعيين كلمة جديدة من «الإدارة ← الموظفون».
٥) رسالة «اسم المستخدم أو كلمة المرور غير صحيحة» تعني خطأً في حالة الأحرف أو مسافة زائدة أو لغة لوحة المفاتيح.
ملاحظة: أنشئ حسابًا مستقلًا لكل موظف لمعرفة من سجّل كل عملية.`,
    },
    keywords: {
      fa: ["ورود", "لاگین", "وارد شدن", "رمز عبور", "پسورد", "نام کاربری", "حساب", "فراموشی رمز", "ورود نمی‌کند", "نمی‌توانم وارد شوم"],
      en: ["login", "sign in", "log in", "password", "username", "account", "forgot password", "cannot login"],
      ar: ["دخول", "تسجيل الدخول", "كلمة المرور", "اسم المستخدم", "حساب", "نسيت كلمة المرور", "لا أستطيع الدخول"],
    },
  },
  {
    id: "language-theme",
    category: "basic",
    titles: { fa: "تغییر زبان و تم", en: "Language and theme", ar: "اللغة والمظهر" },
    answers: {
      fa: `دکمه زبان در نوار بالا (FA/EN/AR) را بزن و فارسی، English یا العربية را انتخاب کن؛ متن سایت، پیام‌ها و فاکتور PDF هم همان زبان می‌شوند.
• در فارسی و عربی جهت صفحه راست‌چین و در انگلیسی چپ‌چین می‌شود.
• دکمه خورشید/ماه حالت روشن و تاریک را عوض می‌کند و در همان مرورگر ذخیره می‌ماند.
• اگر فاکتور با زبان اشتباه چاپ شد، اول زبان را عوض کن و بعد از صفحه فاکتور دوباره PDF بگیر.`,
      en: `Tap the language button (FA/EN/AR) in the top bar and choose Farsi, English or Arabic; the interface, messages and the PDF invoice follow that language.
• Farsi and Arabic flip the layout right to left, English keeps it left to right.
• The sun/moon button switches light and dark mode and remembers it in that browser.
• If an invoice printed in the wrong language, switch language first and download the PDF again.`,
      ar: `اضغط زر اللغة (FA/EN/AR) في الشريط العلوي واختر الفارسية أو الإنجليزية أو العربية؛ تتغير الواجهة والرسائل والفاتورة PDF.
• الفارسية والعربية تجعل الاتجاه من اليمين إلى اليسار والإنجليزية من اليسار إلى اليمين.
• زر الشمس/القمر يبدل الوضع الفاتح والداكن ويُحفظ في المتصفح.
• إذا طُبعت الفاتورة بلغة خاطئة فبدّل اللغة أولًا ثم نزّل PDF مرة أخرى.`,
    },
    keywords: {
      fa: ["زبان", "تغییر زبان", "فارسی", "انگلیسی", "عربی", "تم", "حالت تاریک", "حالت روشن", "راست چین", "چپ چین"],
      en: ["language", "change language", "english", "arabic", "persian", "theme", "dark mode", "light mode", "rtl"],
      ar: ["اللغة", "تغيير اللغة", "العربية", "الإنجليزية", "الفارسية", "المظهر", "الوضع الداكن", "الوضع الفاتح"],
    },
  },
  {
    id: "navigation",
    category: "basic",
    titles: { fa: "منو و صفحه‌های سایت", en: "Menu and pages", ar: "القائمة والصفحات" },
    answers: {
      fa: `منو شامل این بخش‌هاست:
• داشبورد: خلاصه فروش، سود و فاکتورها.
• انبار پارچه: لیست طاقه‌ها، افزودن و ویرایش پارچه و برچسب بارکد.
• فروش: سبد خرید و ثبت فاکتور.
• فاکتورها: لیست فاکتورها، PDF، خروجی اکسل و شروع مرجوعی.
• مرجوعی‌ها: سابقه رسیدهای مرجوعی (Credit Note) و دانلود PDF.
• مشتریان: افزودن، جست‌وجو و سابقه خرید.
• تحلیل: نمودارها و آمار بازه‌های زمانی.
• مدیریت: شعبه‌ها، کارکنان، لوگو و اتصال واتساپ.
با دکمه جمع‌کردن منو فضای صفحه بیشتر می‌شود و در موبایل منو کشویی باز می‌شود.`,
      en: `The menu has these sections:
• Dashboard: sales, profit and invoice summary.
• Inventory: roll list, add/edit fabric and barcode labels.
• Sales: cart and invoice creation.
• Invoices: list, PDF, Excel export and starting a refund.
• Refunds: credit note history with PDF download.
• Customers: add, search and purchase history.
• Analytics: charts and period statistics.
• Manage: branches, staff, logo and WhatsApp connection.
The collapse button widens the page, and on phones the menu opens as a drawer.`,
      ar: `تتضمن القائمة:
• لوحة التحكم: ملخص المبيعات والأرباح والفواتير.
• مخزون الأقمشة: القائمة والإضافة والتعديل وملصقات الباركود.
• البيع: السلة وإنشاء الفاتورة.
• الفواتير: القائمة و PDF وتصدير إكسل وبدء المرتجع.
• المرتجعات: سجل إشعارات الدائن وتنزيل PDF.
• العملاء: الإضافة والبحث وسجل الشراء.
• التحليل: الرسوم وإحصاءات الفترات.
• الإدارة: الفروع والموظفون والشعار وربط واتساب.
زر الطي يوسّع الصفحة، وفي الهاتف تُفتح القائمة كدرج جانبي.`,
    },
    keywords: {
      fa: ["منو", "صفحه‌ها", "کجاست", "کدام صفحه", "بخش", "داشبورد کجاست", "منو کجا رفت", "جمع کردن منو"],
      en: ["menu", "pages", "where is", "section", "navigation", "sidebar", "collapse menu"],
      ar: ["القائمة", "الصفحات", "أين", "قسم", "التنقل", "الشريط الجانبي"],
    },
  },
  {
    id: "dashboard",
    category: "reports",
    titles: { fa: "داشبورد و آمار فروش", en: "Dashboard and sales stats", ar: "لوحة التحكم وإحصاءات البيع" },
    answers: {
      fa: `داشبورد خلاصه وضعیت را نشان می‌دهد: مجموع فروش، سود، تعداد فاکتور، تعداد مشتری و پارچه‌های پرفروش.
• هر نقش داشبورد خودش را می‌بیند: صاحب فروشگاه آمار همه شعبه‌ها، مدیر و فروشنده آمار شعبه خودشان.
• با عوض کردن شعبه فعال، اعداد هم عوض می‌شوند.
• اعداد از فاکتورهای ثبت‌شده می‌آیند؛ فروشی که ثبت نشود در آمار نیست.
• کارت‌های پایین صفحه میان‌بر به آخرین فاکتورها و موجودی کم هستند.
• برای مقایسه بازه‌های زمانی و نمودار کامل‌تر صفحه «تحلیل» را باز کن.`,
      en: `The dashboard summarises the store: total sales, profit, invoice count, customer count and best-selling fabrics.
• Each role sees its own view: the owner sees all branches, managers and sales staff see their branch.
• Changing the active branch changes the numbers.
• Figures come from saved invoices, so an unrecorded sale does not appear.
• The lower cards are shortcuts to recent invoices and low stock.
• For period comparisons and fuller charts open Analytics.`,
      ar: `تلخص لوحة التحكم وضع المتجر: إجمالي المبيعات والأرباح وعدد الفواتير والعملاء والأقمشة الأكثر مبيعًا.
• كل دور يرى لوحته: صاحب المتجر كل الفروع، والمدير والمندوب فرعهما.
• تغيير الفرع النشط يغيّر الأرقام.
• الأرقام تأتي من الفواتير المحفوظة، فالبيع غير المسجل لا يظهر.
• بطاقات الأسفل اختصارات لآخر الفواتير والمخزون المنخفض.
• لمقارنة الفترات ورسوم أوضح افتح صفحة «التحليل».`,
    },
    keywords: {
      fa: ["داشبورد", "آمار", "گزارش فروش", "سود", "نمودار", "پرفروش", "درآمد", "تعداد فاکتور"],
      en: ["dashboard", "stats", "statistics", "report", "profit", "chart", "best selling", "revenue"],
      ar: ["لوحة التحكم", "إحصاءات", "تقرير", "أرباح", "رسم بياني", "الأكثر مبيعًا", "الإيرادات"],
    },
  },
  {
    id: "inventory-list",
    category: "inventory",
    titles: { fa: "جست‌وجو و فیلتر انبار", en: "Searching inventory", ar: "البحث في المخزون" },
    answers: {
      fa: `صفحه «انبار پارچه» هر طاقه را با نام، نوع پارچه، طرح، رنگ، طول، تعداد، قیمت خرید، قیمت فروش، ارزش و سود نشان می‌دهد.
• در کادر جست‌وجو نام قلم یا بارکد را بزن؛ جست‌وجو با بخشی از نام هم کار می‌کند.
• فیلتر نوع پارچه، طرح و وضعیت موجودی را از بالای جدول انتخاب کن.
• با کلیک روی سرستون‌ها می‌توانی بر اساس قیمت، طول یا تعداد مرتب کنی.
• روی هر ردیف بزنی صفحه جزئیات همان قلم باز می‌شود.
• رنگ وضعیت، طاقه‌های کم‌موجود و تمام‌شده را مشخص می‌کند.`,
      en: `The Inventory page lists every roll with name, fabric type, pattern, colour, length, quantity, cost, selling price, value and profit.
• Type a name or barcode in the search box; partial names also match.
• Filter by fabric type, pattern and stock status above the table.
• Click column headers to sort by price, length or quantity.
• Click a row to open that item's detail page.
• The status colour shows low-stock and out-of-stock rolls.`,
      ar: `تعرض صفحة المخزون كل طاقة بالاسم والنوع والنقشة واللون والطول والكمية والتكلفة وسعر البيع والقيمة والربح.
• اكتب الاسم أو الباركود في مربع البحث، ويعمل البحث بجزء من الاسم أيضًا.
• صفِّ حسب نوع القماش والنقشة وحالة المخزون أعلى الجدول.
• اضغط رأس العمود للترتيب حسب السعر أو الطول أو الكمية.
• اضغط أي صف لفتح تفاصيل الصنف.
• لون الحالة يوضح الطاقات القليلة والمنتهية.`,
    },
    keywords: {
      fa: ["انبار", "پارچه", "جست‌وجو", "فیلتر", "موجودی", "طاقه", "بارکد", "لیست پارچه", "مرتب سازی", "پیدا کردن پارچه"],
      en: ["inventory", "fabric list", "search", "filter", "stock", "roll", "barcode", "sort", "find fabric"],
      ar: ["مخزون", "أقمشة", "بحث", "تصفية", "كمية", "طاقة", "باركود", "ترتيب", "إيجاد قماش"],
    },
  },
  {
    id: "inventory-add",
    category: "inventory",
    titles: { fa: "افزودن پارچه جدید", en: "Adding a new fabric", ar: "إضافة قماش جديد" },
    answers: {
      fa: `در صفحه انبار دکمه «افزودن پارچه» را بزن و فرم را پر کن:
۱) بارکد: با اسکنر بخوان یا دستی بزن؛ بارکد تکراری قبول نمی‌شود.
۲) نام قلم، نوع پارچه، طرح، رنگ و ترکیب (مثلاً پنبه/پلی‌استر).
۳) عرض به سانتی‌متر، طول طاقه به متر، تعداد و واحد (متر / طاقه / عدد).
۴) قیمت خرید هر متر، قیمت فروش هر متر و حداقل موجودی برای هشدار کمبود.
۵) شعبه‌ای که پارچه در آن نگهداری می‌شود.
با ذخیره، قلم در انبار همان شعبه ثبت و در فروش قابل انتخاب می‌شود.
نکته: مطمئن شو قیمت فروش از قیمت خرید کمتر نباشد؛ سود گزارش‌ها از همین دو عدد حساب می‌شود.`,
      en: `On the Inventory page press Add fabric and fill the form:
1) Barcode: scan it or type it; duplicates are rejected.
2) Item name, fabric type, pattern, colour and composition (e.g. cotton/polyester).
3) Width in cm, roll length in meters, quantity and unit (meter / roll / piece).
4) Cost per meter, selling price per meter and the minimum stock for low-stock alerts.
5) The branch that holds the fabric.
Saving puts the item in that branch's inventory and makes it selectable in Sales.
Tip: make sure the selling price is not below the cost; profit reports use those two numbers.`,
      ar: `في صفحة المخزون اضغط «إضافة قماش» واملأ النموذج:
١) الباركود: امسحه أو اكتبه، ولا يُقبل المكرر.
٢) اسم الصنف ونوع القماش والنقشة واللون والتركيب (مثل قطن/بوليستر).
٣) العرض بالسنتيمتر وطول الطاقة بالمتر والكمية والوحدة (متر / طاقة / قطعة).
٤) سعر الشراء للمتر وسعر البيع للمتر والحد الأدنى للمخزون لتنبيه النقص.
٥) الفرع الذي يُحفظ فيه القماش.
بعد الحفظ يدخل الصنف مخزون ذلك الفرع ويصبح متاحًا في البيع.
ملاحظة: تأكد أن سعر البيع ليس أقل من الشراء؛ تقارير الربح تعتمد على الرقمين.`,
    },
    keywords: {
      fa: ["افزودن پارچه", "پارچه جدید", "ثبت پارچه", "اضافه کردن پارچه", "پارچه اضافه کنم", "قیمت خرید", "قیمت فروش", "عرض", "طول طاقه", "موجودی اولیه", "بارکد تکراری", "حداقل موجودی"],
      en: ["add fabric", "new fabric", "add item", "create fabric", "cost price", "selling price", "width", "roll length", "min stock", "duplicate barcode"],
      ar: ["إضافة قماش", "قماش جديد", "إضافة صنف", "سعر الشراء", "سعر البيع", "العرض", "طول الطاقة", "الحد الأدنى", "باركود مكرر"],
    },
  },
  {
    id: "inventory-item",
    category: "inventory",
    titles: { fa: "ویرایش، حذف و برچسب پارچه", en: "Edit, delete and label fabric", ar: "تعديل وحذف وملصق القماش" },
    answers: {
      fa: `روی قلم در انبار کلیک کن تا صفحه جزئیات باز شود:
• «ویرایش»: نام، رنگ، طرح، قیمت‌ها، طول و تعداد را عوض کن و ذخیره بزن.
• «حذف»: قلم را از انبار برمی‌دارد؛ اگر روی فاکتور رفته باشد سیستم اجازه نمی‌دهد و باید تعداد را صفر کنی.
• دکمه چاپ: برچسب بارکد قلم را برای چسباندن روی طاقه چاپ می‌کند.
• تغییر قیمت فروش روی فاکتورهای قبلی اثر ندارد و فقط فروش‌های بعدی را عوض می‌کند.
• سابقه فروش همان قلم در پایین صفحه دیده می‌شود.`,
      en: `Click an inventory row to open item details:
• Edit: change name, colour, pattern, prices, length and quantity, then save.
• Delete: removes the item; if it has already been sold the system blocks deletion, so set the quantity to zero instead.
• Print: prints the item's barcode label for the roll.
• Changing the selling price does not rewrite old invoices, only future sales.
• The item's sales history is shown at the bottom of the page.`,
      ar: `اضغط الصنف في المخزون لفتح التفاصيل:
• تعديل: غيّر الاسم واللون والنقشة والأسعار والطول والكمية ثم احفظ.
• حذف: يزيل الصنف، وإذا كان مرتبطًا بفاتورة يمنع النظام الحذف فاجعل الكمية صفرًا.
• طباعة: يطبع ملصق باركود للطاقة.
• تغيير سعر البيع لا يعدّل الفواتير القديمة، بل المبيعات القادمة فقط.
• سجل مبيعات الصنف يظهر أسفل الصفحة.`,
    },
    keywords: {
      fa: ["ویرایش پارچه", "حذف پارچه", "تغییر قیمت", "برچسب بارکد", "چاپ بارکد", "جزئیات قلم", "قیمت را عوض کنم", "پارچه حذف نمی‌شود"],
      en: ["edit fabric", "delete fabric", "change price", "barcode label", "print barcode", "item details", "cannot delete fabric"],
      ar: ["تعديل قماش", "حذف قماش", "تغيير السعر", "ملصق باركود", "طباعة باركود", "تفاصيل الصنف", "لا يمكن حذف القماش"],
    },
  },
  {
    id: "stock-alerts",
    category: "inventory",
    titles: { fa: "کمبود موجودی و هشدارها", en: "Low stock and alerts", ar: "نقص المخزون والتنبيهات" },
    answers: {
      fa: `برای هر پارچه یک «حداقل موجودی» تعیین می‌کنی؛ وقتی تعداد به آن حد برسد، ردیف در انبار با رنگ هشدار نشان داده می‌شود و در داشبورد هم دیده می‌شود.
• وضعیت «تمام‌شده» یعنی تعداد صفر است و در فروش قابل انتخاب نیست.
• برای پر کردن مجدد، تعداد را در صفحه ویرایش قلم افزایش بده؛ نیازی به ساخت قلم تکراری نیست.
• فروش همیشه از تعداد همان شعبه کم می‌شود؛ اگر شعبه دیگری موجودی دارد، از سوییچ شعبه آن را ببین.
• مرجوعی، تعداد را به انبار همان شعبه برگشت می‌دهد.`,
      en: `Each fabric has a minimum stock value; when the quantity reaches it the row is highlighted in Inventory and also appears on the dashboard.
• Out of stock means the quantity is zero and the fabric cannot be chosen in Sales.
• To restock, raise the quantity on the item's edit page instead of creating a duplicate item.
• Sales always deduct from that branch's quantity; switch branch to see another branch's stock.
• A refund adds the quantity back to that branch's inventory.`,
      ar: `لكل قماش حد أدنى للمخزون؛ عند بلوغ الكمية يظهر الصف بلون تنبيه في المخزون وفي لوحة التحكم.
• «منتهي» يعني الكمية صفرًا ولا يمكن اختياره في البيع.
• لإعادة التعبئة زد الكمية من صفحة تعديل الصنف بدل إنشاء صنف مكرر.
• البيع يخصم من كمية ذلك الفرع؛ بدّل الفرع لرؤية مخزون فرع آخر.
• المرتجع يعيد الكمية إلى مخزون الفرع نفسه.`,
    },
    keywords: {
      fa: ["کمبود", "حداقل موجودی", "هشدار موجودی", "تمام شده", "موجودی صفر", "پر کردن انبار", "موجودی شعبه"],
      en: ["low stock", "minimum stock", "stock alert", "out of stock", "zero stock", "restock", "branch stock"],
      ar: ["نقص المخزون", "الحد الأدنى", "تنبيه المخزون", "منتهي", "كمية صفر", "إعادة التعبئة", "مخزون الفرع"],
    },
  },
  {
    id: "customers-add",
    category: "customers",
    titles: { fa: "افزودن مشتری جدید", en: "Adding a customer", ar: "إضافة عميل جديد" },
    answers: {
      fa: `در صفحه «مشتریان» دکمه «مشتری جدید» را بزن و فقط این‌ها را پر کن:
• نام کامل، شماره تلفن، جنسیت (مرد/زن) و آدرس.
• نوع مشتری: Regular (عادی)، VIP یا Wholesaler (عمده‌فروش).
• یادداشت اختیاری برای هر نکته‌ای که لازم داری (اندازه، سلیقه، ساعت مراجعه).
شماره کارت شناسایی یا ملی لازم نیست و از مشتری گرفته نمی‌شود.
همین فرم از دکمه + کنار جست‌وجوی مشتری در صفحه فروش هم باز می‌شود؛ بعد از ذخیره مشتری خودکار انتخاب می‌شود.
تلفن را با کد کشور (مثل 965…) بزن تا ارسال فاکتور با واتساپ درست کار کند.`,
      en: `On the Customers page press New customer and fill only these:
• Full name, phone, gender (male/female) and address.
• Customer type: Regular, VIP or Wholesaler.
• Optional notes for anything you need (size, taste, preferred visit time).
No national or civil ID number is required and none is collected.
The same form opens from the + button next to customer search on the Sales page and selects the new customer automatically.
Enter the phone with the country code (e.g. 965…) so WhatsApp invoice sending works.`,
      ar: `في صفحة العملاء اضغط «عميل جديد» واملأ فقط:
• الاسم الكامل ورقم الهاتف والجنس (ذكر/أنثى) والعنوان.
• نوع العميل: Regular أو VIP أو Wholesaler (جملة).
• ملاحظات اختيارية لأي شيء تحتاجه (المقاس، الذوق، وقت الزيارة).
لا حاجة لرقم الهوية أو الرقم المدني ولا يُطلب من العميل.
نفس النموذج يفتح من زر + بجانب بحث العملاء في صفحة البيع ويحدد العميل تلقائيًا.
أدخل الهاتف مع رمز الدولة (مثل 965…) ليعمل إرسال الفاتورة بواتساب.`,
    },
    keywords: {
      fa: ["مشتری جدید", "افزودن مشتری", "اضافه کردن مشتری", "مشتری اضافه کنم", "ثبت مشتری", "شماره تلفن مشتری", "نوع مشتری", "وی‌آی‌پی", "عمده فروش", "کارت شناسایی مشتری", "آدرس مشتری"],
      en: ["add customer", "new customer", "customer type", "vip", "wholesaler", "phone", "customer id card", "customer address"],
      ar: ["إضافة عميل", "عميل جديد", "نوع العميل", "جملة", "هاتف", "بطاقة العميل", "عنوان العميل"],
    },
  },
  {
    id: "customers-manage",
    category: "customers",
    titles: { fa: "مدیریت و سابقه مشتری", en: "Customer history", ar: "سجل العميل" },
    answers: {
      fa: `در لیست مشتریان با نام، تلفن یا آدرس جست‌وجو کن؛ با دکمه ویرایش اطلاعات را عوض کن.
• مشتری که فاکتور دارد حذف نمی‌شود؛ برای کنار گذاشتنش یادداشت بگذار یا نوعش را عوض کن.
• با کلیک روی مشتری صفحه او باز می‌شود: مجموع خرید، تعداد فاکتور، آخرین مراجعه، پارچه و طرح مورد علاقه و لیست فاکتورها با دکمه PDF.
• از همان صفحه می‌توانی فاکتور قبلی را ببینی و اگر لازم بود مرجوعی ثبت کنی.
• سابقه خرید در انتخاب مشتری در صفحه فروش هم کمک می‌کند.`,
      en: `Search the customer list by name, phone or address and use Edit to change details.
• A customer with invoices cannot be deleted; add a note or change their type instead.
• Clicking a customer opens their page: total spent, invoice count, last visit, favourite fabric and pattern, and invoices with a PDF button.
• From there you can open an old invoice or start a refund.
• Their history also helps pick the right customer during a sale.`,
      ar: `ابحث في قائمة العملاء بالاسم أو الهاتف أو العنوان واستخدم تعديل لتغيير البيانات.
• لا يمكن حذف عميل لديه فواتير؛ أضف ملاحظة أو غيّر نوعه.
• الضغط على العميل يفتح صفحته: إجمالي الشراء وعدد الفواتير وآخر زيارة والقماش والنقشة المفضلة وقائمة الفواتير مع زر PDF.
• من هناك يمكن فتح فاتورة قديمة أو بدء مرتجع.
• سجله يساعد أيضًا في اختيار العميل الصحيح أثناء البيع.`,
    },
    keywords: {
      fa: ["لیست مشتریان", "سابقه مشتری", "حذف مشتری", "ویرایش مشتری", "خرید مشتری", "جست‌وجوی مشتری", "تاریخچه خرید"],
      en: ["customer list", "customer history", "delete customer", "edit customer", "customer purchases", "search customer"],
      ar: ["قائمة العملاء", "سجل العميل", "حذف عميل", "تعديل عميل", "مشتريات العميل", "بحث عن عميل"],
    },
  },

  {
    id: "customer-types",
    category: "customers",
    titles: { fa: "نوع مشتری و تخفیف", en: "Customer types and discounts", ar: "أنواع العملاء والخصم" },
    answers: {
      fa: `نوع مشتری سه حالت دارد و در فاکتور و لیست مشتریان نمایش داده می‌شود:
• Regular: مشتری عادی فروشگاه.
• VIP: مشتری خاص؛ برای پیگیری و پیشنهادهای ویژه.
• Wholesaler: عمده‌فروش که معمولاً متراژ بیشتر می‌خرد.
نوع مشتری خودش تخفیف اعمال نمی‌کند؛ تخفیف را در هر ردیف سبد یا در جمع فاکتور دستی وارد می‌کنی.
نوع را می‌توانی بعداً از صفحه ویرایش مشتری عوض کنی.
در گزارش‌ها می‌توانی ببینی هر گروه چقدر خرید کرده است.`,
      en: `Customer type has three values and is shown on invoices and the customer list:
• Regular: an ordinary walk-in customer.
• VIP: a special customer to follow up and offer deals to.
• Wholesaler: buys larger volumes.
The type does not apply a discount by itself; you enter the discount per cart line or on the invoice total.
You can change the type later from the customer's edit page.
Reports let you see how much each group bought.`,
      ar: `لنوع العميل ثلاث قيم ويظهر في الفاتورة وقائمة العملاء:
• Regular: عميل عادي.
• VIP: عميل مميز للمتابعة والعروض.
• Wholesaler: يشتري كميات أكبر.
النوع لا يطبّق خصمًا تلقائيًا؛ تُدخل الخصم في كل سطر أو على إجمالي الفاتورة.
يمكن تغيير النوع لاحقًا من صفحة تعديل العميل.
تتيح التقارير معرفة حجم شراء كل فئة.`,
    },
    keywords: {
      fa: ["نوع مشتری", "وی‌آی‌پی", "عمده فروش", "مشتری عادی", "تخفیف مشتری", "Regular", "Wholesaler"],
      en: ["customer type", "vip", "wholesaler", "regular customer", "customer discount"],
      ar: ["نوع العميل", "عميل مميز", "جملة", "عميل عادي", "خصم العميل"],
    },
  },
  {
    id: "sales",
    category: "sales",
    titles: { fa: "ثبت فروش", en: "Recording a sale", ar: "تسجيل عملية بيع" },
    answers: {
      fa: `۱) از منو «فروش» را باز کن و مطمئن شو شعبه فعال درست است.
۲) مشتری را از کادر جست‌وجو انتخاب کن یا با + مشتری جدید بساز.
۳) پارچه را با نام یا بارکد جست‌وجو کن و به سبد اضافه کن؛ دکمه اسکن هم بارکدخوان را فعال می‌کند.
۴) در هر ردیف متراژ، تعداد، قیمت هر متر و تخفیف را وارد کن؛ جمع ردیف خودکار حساب می‌شود.
۵) روش پرداخت (نقد، K-Net، ویزا/مستر، لینک، چک) و مبلغ را بزن؛ اگر پرداخت تقسیم شده، روش دیگری اضافه کن تا مانده صفر شود.
۶) «تکمیل فروش» را بزن؛ فاکتور ساخته می‌شود و پنجره چاپ/واتساپ باز می‌شود.
نکته: اگر مانده صفر نشود دکمه تکمیل فروش اجازه نمی‌دهد؛ مبلغ‌ها را چک کن.`,
      en: `1) Open Sales from the menu and confirm the active branch.
2) Pick the customer from the search box or create one with +.
3) Search the fabric by name or barcode and add it to the cart; the scan button listens to the barcode reader.
4) In each row set meters, quantity, price per meter and discount; the line total is calculated for you.
5) Choose the payment method (Cash, K-Net, Visa/Master, Link, Cheque) and the amount; if the payment is split, add another method until the remaining is zero.
6) Press Complete sale; the invoice is created and the print/WhatsApp dialog opens.
Tip: while the remaining amount is not zero the Complete sale button stays blocked.`,
      ar: `١) افتح «البيع» من القائمة وتأكد من الفرع النشط.
٢) اختر العميل من مربع البحث أو أنشئ واحدًا بزر +.
٣) ابحث عن القماش بالاسم أو الباركود وأضفه إلى السلة؛ زر المسح يفعّل قارئ الباركود.
٤) في كل سطر أدخل الأمتار والكمية وسعر المتر والخصم، ويُحسب الإجمالي تلقائيًا.
٥) اختر طريقة الدفع (نقدًا، K-Net، فيزا/ماستر، رابط، شيك) والمبلغ؛ وإذا كان الدفع مقسمًا أضف طريقة أخرى حتى يصبح المتبقي صفرًا.
٦) اضغط «إتمام البيع» لتُنشأ الفاتورة وتُفتح نافذة الطباعة/واتساب.
ملاحظة: يبقى زر إتمام البيع معطلًا حتى يصبح المتبقي صفرًا.`,
    },
    keywords: {
      fa: ["فروش", "ثبت فروش", "فاکتور فروش", "بفروشم", "می‌خواهم بفروشم", "سبد خرید", "اضافه کردن به سبد", "تخفیف", "پرداخت", "تکمیل فروش", "متراژ", "بارکد اسکن", "فروش ثبت نمی‌شود"],
      en: ["sale", "sell", "record sale", "cart", "add to cart", "discount", "payment", "complete sale", "meters", "scan barcode"],
      ar: ["بيع", "تسجيل بيع", "سلة", "إضافة إلى السلة", "خصم", "دفع", "إتمام البيع", "أمتار", "مسح باركود"],
    },
  },
  {
    id: "sales-payments",
    category: "sales",
    titles: { fa: "روش‌های پرداخت و مانده", en: "Payment methods and balance", ar: "طرق الدفع والمتبقي" },
    answers: {
      fa: `روش‌های پرداخت: نقد (Cash)، K-Net، ویزا/مسترکارت، لینک پرداخت و چک.
• می‌توانی مبلغ را بین چند روش تقسیم کنی؛ هر روش را جدا اضافه کن.
• مجموع پرداخت‌ها باید با مبلغ نهایی فاکتور برابر شود تا دکمه تکمیل فروش فعال شود.
• اگر مشتری بخشی را بعداً می‌دهد، مانده را در فاکتور ثبت کن و در یادداشت مشتری بنویس.
• مبلغ‌ها به دینار کویت و با سه رقم اعشار نمایش داده می‌شوند.
• برای چک، شماره یا توضیح چک را در یادداشت فاکتور بنویس.`,
      en: `Payment methods: Cash, K-Net, Visa/MasterCard, payment Link and Cheque.
• You can split the amount across several methods; add each one separately.
• The payments must add up to the invoice total before Complete sale becomes available.
• If the customer pays part later, record the balance on the invoice and note it on the customer.
• Amounts are in Kuwaiti Dinar with three decimal places.
• For a cheque, write the cheque number or details in the invoice note.`,
      ar: `طرق الدفع: نقدًا، K-Net، فيزا/ماستركارت، رابط دفع وشيك.
• يمكن تقسيم المبلغ على عدة طرق، وأضف كل طريقة منفصلة.
• يجب أن يساوي مجموع المدفوعات إجمالي الفاتورة ليصبح زر إتمام البيع متاحًا.
• إذا دفع العميل جزءًا لاحقًا فسجّل المتبقي في الفاتورة وملاحظة العميل.
• المبالغ بالدينار الكويتي بثلاث خانات عشرية.
• في الشيك اكتب رقمه أو تفاصيله في ملاحظة الفاتورة.`,
    },
    keywords: {
      fa: ["پرداخت", "روش پرداخت", "نقد", "کی نت", "K-Net", "ویزا", "مستر", "لینک پرداخت", "چک", "مانده", "پرداخت تقسیمی", "دینار"],
      en: ["payment method", "cash", "k-net", "visa", "mastercard", "payment link", "cheque", "remaining", "split payment", "kwd"],
      ar: ["طريقة الدفع", "نقدًا", "كي نت", "فيزا", "ماستر", "رابط دفع", "شيك", "المتبقي", "دفع مقسم", "دينار"],
    },
  },
  {
    id: "invoices",
    category: "sales",
    titles: { fa: "فاکتورها، PDF و اکسل", en: "Invoices, PDF and Excel", ar: "الفواتير و PDF وإكسل" },
    answers: {
      fa: `صفحه «فاکتورها» همه فاکتورهای شعبه را با شماره، تاریخ، مشتری و مبلغ نشان می‌دهد.
• با شماره فاکتور یا نام مشتری جست‌وجو کن و بازه تاریخ را فیلتر کن.
• دکمه PDF فاکتور را باز می‌کند؛ از آنجا چاپ یا ذخیره کن.
• دکمه «خروجی» گزارش بازه انتخابی را در فایل Excel می‌دهد.
• روی هر فاکتور دکمه «مرجوعی» هست که صفحه مرجوعی را با همان فاکتور پر می‌کند.
• فاکتور ثبت‌شده قابل ویرایش نیست؛ اگر اشتباه شد مرجوعی بزن و فاکتور درست را ثبت کن.`,
      en: `The Invoices page lists every invoice of the branch with number, date, customer and amount.
• Search by invoice number or customer name and filter by date range.
• The PDF button opens the invoice for printing or saving.
• Export downloads the selected range as an Excel file.
• Each invoice has a Refund button that opens the refund page pre-filled.
• A saved invoice cannot be edited; if it is wrong, refund it and record the correct one.`,
      ar: `تعرض صفحة الفواتير كل فواتير الفرع مع الرقم والتاريخ والعميل والمبلغ.
• ابحث برقم الفاتورة أو اسم العميل وصفِّ حسب التاريخ.
• زر PDF يفتح الفاتورة للطباعة أو الحفظ.
• «تصدير» ينزل الفترة المحددة كملف إكسل.
• لكل فاتورة زر «مرتجع» يفتح صفحة المرتجع معبأة.
• لا يمكن تعديل فاتورة محفوظة؛ إن كانت خاطئة فاعمل مرتجعًا وسجّل الفاتورة الصحيحة.`,
    },
    keywords: {
      fa: ["فاکتور", "فاکتورها", "PDF", "چاپ فاکتور", "دانلود فاکتور", "اکسل", "خروجی", "گزارش فاکتور", "فاکتور نمی‌آید", "ویرایش فاکتور"],
      en: ["invoice", "invoices", "pdf", "print invoice", "download invoice", "excel", "export", "invoice report", "edit invoice"],
      ar: ["فاتورة", "فواتير", "PDF", "طباعة الفاتورة", "تنزيل الفاتورة", "إكسل", "تصدير", "تقرير الفواتير", "تعديل الفاتورة"],
    },
  },
  {
    id: "invoice-content",
    category: "sales",
    titles: { fa: "محتوای فاکتور چاپی", en: "What the invoice shows", ar: "محتويات الفاتورة" },
    answers: {
      fa: `فاکتور PDF شامل این موارد است:
• سربرگ فروشگاه با لوگوی شعبه، نام، آدرس و تلفن.
• شماره فاکتور، تاریخ و نام فروشنده.
• نام، تلفن، آدرس و نوع مشتری.
• جدول اقلام: نوع پارچه، طرح، رنگ، متراژ، قیمت هر متر، تخفیف و جمع هر ردیف.
• جمع متراژ، جمع کل به دینار کویت و روش‌های پرداخت.
• فرم «الغرض من الشراء» و شرایط پارچه.
اگر لوگو ندارید، در «مدیریت ← شعبه ← لوگو» آپلود کن؛ روی فاکتور بعدی اعمال می‌شود.`,
      en: `The PDF invoice contains:
• Store header with the branch logo, name, address and phone.
• Invoice number, date and the sales person's name.
• Customer name, phone, address and type.
• Item table: fabric type, pattern, colour, meters, price per meter, discount and line total.
• Total meters, grand total in KWD and the payment methods.
• The “purpose of purchase” form and the fabric terms.
If you have no logo, upload one in Manage → Branch → Logo; it appears on the next invoice.`,
      ar: `تتضمن الفاتورة PDF:
• ترويسة المتجر مع شعار الفرع والاسم والعنوان والهاتف.
• رقم الفاتورة والتاريخ واسم المندوب.
• اسم العميل وهاتفه وعنوانه ونوعه.
• جدول الأصناف: نوع القماش والنقشة واللون والأمتار وسعر المتر والخصم وإجمالي السطر.
• مجموع الأمتار والإجمالي بالدينار وطرق الدفع.
• نموذج «الغرض من الشراء» وشروط الأقمشة.
إذا لم يكن لديك شعار فارفعه من «الإدارة ← الفرع ← الشعار» ليظهر في الفاتورة التالية.`,
    },
    keywords: {
      fa: ["محتوای فاکتور", "لوگو فاکتور", "سربرگ", "شرایط پارچه", "الغرض من الشراء", "هدف خرید", "دینار کویت", "سه رقم اعشار"],
      en: ["invoice content", "invoice logo", "header", "fabric terms", "purchase purpose", "kwd", "decimals"],
      ar: ["محتويات الفاتورة", "شعار الفاتورة", "الترويسة", "شروط القماش", "الغرض من الشراء", "دينار", "خانات عشرية"],
    },
  },
  {
    id: "refund",
    category: "refunds",
    titles: { fa: "ثبت مرجوعی", en: "Creating a refund", ar: "إنشاء مرتجع" },
    answers: {
      fa: `۱) از منو «مرجوعی‌ها» دکمه مرجوعی جدید یا از صفحه فاکتورها دکمه «مرجوعی» را بزن.
۲) شماره یا شناسه فاکتور را وارد کن و جست‌وجو بزن.
۳) از اقلام فاکتور، هر قلم و تعدادی که برگشت می‌خورد را انتخاب کن.
۴) روش پرداخت برگشت (نقد، K-Net، …) و مبلغ را بزن؛ جمع پرداخت‌ها باید با مبلغ مرجوعی برابر باشد.
۵) ثبت را بزن؛ «رسید مرجوعی» (Credit Note) با شماره خودش صادر می‌شود.
PDF رسید را از همان صفحه یا صفحه «مرجوعی‌ها» دانلود کن.
موجودی اقلام برگشتی به‌صورت خودکار به انبار همان شعبه اضافه می‌شود.`,
      en: `1) From Refunds press the new refund button, or press Refund on an invoice row.
2) Enter the invoice number or ID and search.
3) Select the items and quantities being returned.
4) Choose the refund method (Cash, K-Net, …) and amount; payments must equal the refund total.
5) Submit; a credit note is issued with its own number.
Download its PDF from that page or from the Refunds list.
Returned items are added back to that branch's inventory automatically.`,
      ar: `١) من صفحة المرتجعات اضغط زر مرتجع جديد، أو زر «مرتجع» في صف الفاتورة.
٢) أدخل رقم الفاتورة أو معرفها وابحث.
٣) اختر الأصناف والكميات المرتجعة.
٤) اختر طريقة الإرجاع (نقدًا، K-Net، …) والمبلغ، ويجب أن يتساوى مجموع المدفوعات مع مبلغ المرتجع.
٥) اضغط إرسال ليصدر إشعار دائن برقم خاص.
نزّل PDF من نفس الصفحة أو من قائمة المرتجعات.
تُعاد الأصناف المرتجعة تلقائيًا إلى مخزون الفرع نفسه.`,
    },
    keywords: {
      fa: ["مرجوعی", "مرجوع", "برگشت کالا", "پس دادن", "کریدیت نوت", "رسید مرجوعی", "لغو فاکتور", "پول برگشت", "مرجوعی ثبت کنم"],
      en: ["refund", "refunds", "return item", "credit note", "money back", "cancel invoice", "return fabric"],
      ar: ["مرتجع", "إرجاع", "إشعار دائن", "استرداد المال", "إلغاء فاتورة", "إرجاع قماش"],
    },
  },
  {
    id: "refunds-list",
    category: "refunds",
    titles: { fa: "لیست مرجوعی‌ها", en: "Refund history", ar: "سجل المرتجعات" },
    answers: {
      fa: `صفحه «مرجوعی‌ها» سابقه همه رسیدهای مرجوعی را نشان می‌دهد: شماره Credit Note، شماره فاکتور اصلی، تاریخ، مبلغ، ثبت‌کننده و دکمه PDF.
• با شماره رسید یا شماره فاکتور جست‌وجو کن.
• بازه تاریخ را فیلتر کن تا فقط مرجوعی‌های همان دوره ببینی.
• صاحب فروشگاه می‌تواند چند شعبه را با هم ببیند؛ مدیر و فروشنده فقط شعبه خودشان.
• اگر لیست خالی است یعنی هنوز مرجوعی ثبت نشده یا فیلتر تاریخ اشتباه است.
• برای مرجوعی جدید دکمه بالای صفحه را بزن.`,
      en: `The Refunds page lists every credit note: credit note number, original invoice number, date, amount, who created it and a PDF button.
• Search by credit note or invoice number.
• Filter a date range to see only that period.
• The owner can select several branches; managers and sales staff see their own.
• An empty list means no refunds were recorded yet or the date filter is off.
• Use the top button to create a new refund.`,
      ar: `تعرض صفحة المرتجعات كل إشعارات الدائن: رقم الإشعار ورقم الفاتورة الأصلية والتاريخ والمبلغ ومن أنشأه وزر PDF.
• ابحث برقم الإشعار أو الفاتورة.
• صفِّ حسب نطاق التاريخ لرؤية تلك الفترة فقط.
• صاحب المتجر يمكنه اختيار عدة فروع، والمدير والمندوب يرون فرعهم فقط.
• القائمة الفارغة تعني عدم وجود مرتجعات أو خطأً في تصفية التاريخ.
• استخدم الزر العلوي لإنشاء مرتجع جديد.`,
    },
    keywords: {
      fa: ["لیست مرجوعی", "سابقه مرجوعی", "تاریخ مرجوعی", "رسید مرجوعی کجاست", "دانلود کریدیت نوت", "مرجوعی‌ها خالی"],
      en: ["refund list", "refund history", "credit note list", "download credit note", "no refunds"],
      ar: ["قائمة المرتجعات", "سجل المرتجعات", "إشعار دائن", "تنزيل إشعار دائن", "لا مرتجعات"],
    },
  },
  {
    id: "whatsapp-connect",
    category: "whatsapp",
    titles: { fa: "اتصال واتساپ فروشگاه", en: "Connecting the store WhatsApp", ar: "ربط واتساب المتجر" },
    answers: {
      fa: `این کار فقط با نقش صاحب فروشگاه انجام می‌شود.
۱) از منو «مدیریت» را باز کن و روی شعبه بزن.
۲) تب «اتصال واتساپ» را انتخاب کن و دکمه اتصال را بزن تا QR ظاهر شود.
۳) در گوشی واتساپ → Settings → Linked devices → Link a device و QR را اسکن کن.
۴) چند ثانیه صبر کن تا وضعیت «متصل» (CONNECTED) شود؛ شماره متصل هم نمایش داده می‌شود.
صفحه هر ۹۰ ثانیه وضعیت را به‌روز می‌کند و اتصال تا ۹۰ ثانیه زمان دارد.
برای عوض کردن شماره یا رفع مشکل، از همان تب دکمه قطع اتصال را بزن و دوباره وصل کن.`,
      en: `Only the store owner can do this.
1) Open Manage from the menu and select the branch.
2) Choose the Connect WhatsApp tab and press connect to get the QR code.
3) On the phone open WhatsApp → Settings → Linked devices → Link a device and scan the QR.
4) Wait a few seconds; the status must become CONNECTED and the linked number appears.
The page refreshes the status every 90 seconds and connecting waits up to 90 seconds.
To change the number or fix a problem use Disconnect on the same tab and connect again.`,
      ar: `هذه الخطوة لصاحب المتجر فقط.
١) افتح «الإدارة» واختر الفرع.
٢) اختر تبويب «ربط واتساب» واضغط زر الربط ليظهر رمز QR.
٣) في الهاتف: واتساب → الإعدادات → الأجهزة المرتبطة → ربط جهاز وامسح الرمز.
٤) انتظر ثوانٍ حتى تصبح الحالة «متصل» ويظهر الرقم المرتبط.
تحدّث الصفحة الحالة كل ٩٠ ثانية والربط ينتظر حتى ٩٠ ثانية.
لتغيير الرقم أو حل مشكلة استخدم زر فصل الاتصال ثم أعد الربط.`,
    },
    keywords: {
      fa: ["واتساپ", "اتصال واتساپ", "وصل کردن واتساپ", "نصب واتساپ", "اضافه کردن واتساپ", "واتساپ اضافه کنم", "افزودن واتساپ", "واتساپ فروشگاه", "واتساپ رو اضافه", "QR", "کیو آر", "اسکن واتساپ", "دستگاه‌های متصل", "قطع واتساپ"],
      en: ["whatsapp", "connect whatsapp", "add whatsapp", "enable whatsapp", "whatsapp setup", "install whatsapp", "store whatsapp", "qr", "scan qr", "linked devices", "disconnect whatsapp"],
      ar: ["واتساب", "ربط واتساب", "إضافة واتساب", "اضافة واتساب", "تفعيل واتساب", "واتساب المتجر", "تثبيت واتساب", "رمز QR", "مسح الرمز", "الأجهزة المرتبطة", "فصل واتساب"],
    },
  },
  {
    id: "whatsapp-send",
    category: "whatsapp",
    titles: { fa: "فرستادن فاکتور با واتساپ", en: "Sending invoices on WhatsApp", ar: "إرسال الفواتير عبر واتساب" },
    answers: {
      fa: `اول باید واتساپ شعبه متصل باشد.
• صاحب فروشگاه یا مدیر شعبه در صفحه شعبه، کلید «ارسال فاکتور به مشتری با واتساپ» را روشن می‌کند.
• بعد از تکمیل فروش یا از صفحه فاکتورها دکمه واتساپ را بزن؛ شماره مشتری را تأیید یا عوض کن.
• اگر شماره مشتری ثبت نشده باشد همان‌جا وارد کن و با کد کشور بنویس.
• ارسال به‌صورت PDF فاکتور انجام می‌شود.
• اگر دکمه واتساپ غیرفعال است یعنی کلید شعبه روشن نشده یا واتساپ قطع است.`,
      en: `The branch WhatsApp must be connected first.
• The store owner or branch manager turns on Send invoice to customer via WhatsApp on the branch page.
• After completing a sale, or from the Invoices page, press the WhatsApp button and confirm or change the customer number.
• If the customer has no phone saved, enter it there with the country code.
• The invoice is sent as a PDF.
• A disabled WhatsApp button means the branch switch is off or WhatsApp is disconnected.`,
      ar: `يجب ربط واتساب الفرع أولًا.
• صاحب المتجر أو مدير الفرع يفعّل «إرسال الفاتورة إلى العميل عبر واتساب» في صفحة الفرع.
• بعد إتمام البيع أو من صفحة الفواتير اضغط زر واتساب وأكّد رقم العميل أو غيّره.
• إذا لم يكن للعميل رقم فأدخله هناك مع رمز الدولة.
• تُرسل الفاتورة بصيغة PDF.
• زر واتساب المعطل يعني أن مفتاح الفرع غير مفعّل أو واتساب غير متصل.`,
    },
    keywords: {
      fa: ["ارسال فاکتور", "فاکتور واتساپ", "واتساپ مشتری", "شماره واتساپ", "نسخه فروشگاه", "پیام واتساپ", "واتساپ غیرفعال"],
      en: ["send invoice", "invoice whatsapp", "customer whatsapp", "whatsapp number", "send pdf whatsapp", "whatsapp disabled"],
      ar: ["إرسال فاتورة", "فاتورة واتساب", "واتساب العميل", "رقم واتساب", "إرسال PDF", "واتساب معطل"],
    },
  },

  {
    id: "whatsapp-bulk",
    category: "whatsapp",
    titles: { fa: "پیام گروهی واتساپ", en: "WhatsApp bulk messages", ar: "رسائل واتساب الجماعية" },
    answers: {
      fa: `فقط صاحب فروشگاه در «مدیریت ← شعبه ← پیام گروهی» می‌تواند پیام همگانی بفرستد.
۱) گروه مخاطبان را انتخاب کن (همه مشتریان یا گروه انتخابی).
۲) متن پیام را بنویس و شماره‌های دارای تلفن خودکار انتخاب می‌شوند.
۳) فاصله بین پیام‌ها (تأخیر) را تعیین کن؛ تأخیر بیشتر احتمال بلاک شدن شماره را کم می‌کند.
۴) ارسال را بزن و نتیجه (تعداد ارسال‌شده از کل) را ببین.
پیام گروهی از همان واتساپ متصل شعبه فرستاده می‌شود، پس اتصال باید برقرار باشد.
برای پیام تبلیغاتی رضایت مشتری و قوانین واتساپ را رعایت کن.`,
      en: `Only the store owner can send bulk messages from Manage → Branch → Bulk messages.
1) Choose the audience (all customers or a selected group).
2) Write the message; numbers with a saved phone are picked automatically.
3) Set the delay between messages; a longer delay lowers the risk of the number being blocked.
4) Press send and check the result (sent out of total).
Bulk messages go out from the branch's connected WhatsApp, so the link must be active.
For promotional messages respect customer consent and WhatsApp policy.`,
      ar: `صاحب المتجر فقط يرسل الرسائل الجماعية من «الإدارة ← الفرع ← رسائل جماعية».
١) اختر الجمهور (كل العملاء أو مجموعة محددة).
٢) اكتب النص؛ تُختار الأرقام التي لديها هاتف تلقائيًا.
٣) حدد التأخير بين الرسائل؛ التأخير الأطول يقلل خطر حجب الرقم.
٤) اضغط إرسال وراقب النتيجة (المرسل من الإجمالي).
تُرسل الرسائل من واتساب الفرع المتصل، فيجب أن يكون الاتصال قائمًا.
في الرسائل الترويجية راعِ موافقة العميل وسياسة واتساب.`,
    },
    keywords: {
      fa: ["پیام گروهی", "پیام همگانی", "ارسال گروهی", "تبلیغات واتساپ", "پیام به همه مشتریان", "bulk"],
      en: ["bulk message", "bulk send", "broadcast", "whatsapp campaign", "message all customers"],
      ar: ["رسائل جماعية", "إرسال جماعي", "بث", "حملة واتساب", "رسالة لكل العملاء"],
    },
  },
  {
    id: "whatsapp-troubleshoot",
    category: "whatsapp",
    titles: { fa: "واتساپ وصل نمی‌شود", en: "WhatsApp will not connect", ar: "واتساب لا يتصل" },
    answers: {
      fa: `• QR را با همان گوشی و همان حسابی اسکن کن که فروشگاه روی آن است.
• اگر QR منقضی شده، صفحه را رفرش کن و QR تازه بگیر.
• گوشی باید اینترنت داشته و واتساپ باز باشد؛ حالت هواپیما یا باتری‌سیور اتصال را قطع می‌کند.
• اگر بعد از اسکن وضعیت متصل نشد، یک‌بار قطع اتصال و دوباره وصل کن.
• اگر لینک روی گوشی دیگری فعال است، اول آن را از Linked devices بردار.
• اگر باز هم نشد با پشتیبانی تماس بگیر.`,
      en: `• Scan the QR with the exact phone and WhatsApp account the store should use.
• If the QR expired, refresh the page and get a new one.
• The phone needs internet and WhatsApp running; airplane mode or battery saver drops the link.
• If it stays disconnected after scanning, disconnect and connect again.
• If the account is already linked on another phone, remove it from Linked devices first.
• If it still fails, contact support.`,
      ar: `• امسح رمز QR بنفس الهاتف وحساب واتساب المخصص للمتجر.
• إذا انتهت صلاحية الرمز فحدّث الصفحة واطلب رمزًا جديدًا.
• يجب أن يكون الهاتف متصلًا بالإنترنت وواتساب يعمل؛ وضع الطيران أو موفر البطارية يقطع الربط.
• إذا بقيت الحالة غير متصلة بعد المسح فافصل ثم أعد الربط.
• إذا كان الحساب مرتبطًا بهاتف آخر فأزله من الأجهزة المرتبطة أولًا.
• إذا استمرت المشكلة تواصل مع الدعم.`,
    },
    keywords: {
      fa: ["واتساپ وصل نمی‌شود", "واتساپ قطع شد", "خطای واتساپ", "QR کار نمی‌کند", "واتساپ آنلاین نیست", "قطع مکرر واتساپ", "کد QR منقضی"],
      en: ["whatsapp not connecting", "whatsapp disconnected", "whatsapp error", "qr not working", "whatsapp offline", "keeps disconnecting"],
      ar: ["واتساب لا يتصل", "انقطع واتساب", "خطأ واتساب", "الرمز لا يعمل", "واتساب غير متصل"],
    },
  },
  {
    id: "analytics",
    category: "reports",
    titles: { fa: "صفحه تحلیل و نمودارها", en: "Analytics and charts", ar: "التحليل والرسوم" },
    answers: {
      fa: `صفحه «تحلیل» آمار دقیق‌تر می‌دهد:
• بازه زمانی: ۷ روز، ۳۰ روز، ۹۰ روز یا بازه دلخواه با تاریخ شروع و پایان.
• شاخص: «درآمد» یا «سود» را انتخاب کن تا نمودارها بر همان اساس رسم شوند.
• نمایش: به‌صورت «ارزش به دینار» یا «تعداد اقلام».
• مقایسه: با تیک Compare، بازه فعلی را با دوره قبل، هفته قبل، ماه قبل، فصل قبل، سال قبل یا همان ماه سال گذشته مقایسه کن.
• صاحب فروشگاه می‌تواند چند شعبه را انتخاب کند؛ بقیه نقش‌ها شعبه خودشان را می‌بینند.
• جدول اقلام پرفروش و نمودار سهم هر نوع پارچه و عملکرد شعبه‌ها هم در همین صفحه است.
اگر نمودار خالی است، بازه تاریخ را بزرگ‌تر کن یا فروش ثبت نشده است.`,
      en: `Analytics gives more precise numbers:
• Period: last 7, 30 or 90 days, or a custom start and end date.
• Metric: switch between Revenue and Profit to drive the charts.
• View: value in KWD or quantity of items.
• Compare: tick it to compare against the previous period, week, month, quarter, year or the same month last year.
• The owner can select several branches; other roles see their own.
• Top items, fabric type share and branch performance are on the same page.
An empty chart means the date range is too narrow or nothing was sold.`,
      ar: `صفحة «التحليل» تعطي أرقامًا أدق:
• الفترة: ٧ أو ٣٠ أو ٩٠ يومًا أو نطاق مخصص بتاريخ بداية ونهاية.
• المؤشر: بدّل بين الإيراد والربح لتتغير الرسوم.
• العرض: القيمة بالدينار أو كمية الأصناف.
• المقارنة: فعّل Compare للمقارنة مع الفترة أو الأسبوع أو الشهر أو الربع أو السنة السابقة أو نفس الشهر من العام الماضي.
• صاحب المتجر يختار عدة فروع، وبقية الأدوار ترى فرعها.
• الأصناف الأكثر مبيعًا وحصة أنواع الأقمشة وأداء الفروع في نفس الصفحة.
الرسم الفارغ يعني نطاق تاريخ ضيقًا أو عدم وجود مبيعات.`,
    },
    keywords: {
      fa: ["تحلیل", "نمودار", "گزارش بازه", "مقایسه دوره", "سود و درآمد", "اقلام پرفروش", "عملکرد شعبه", "آمار دقیق"],
      en: ["analytics", "charts", "period report", "compare period", "revenue profit", "top items", "branch performance"],
      ar: ["تحليل", "رسوم بيانية", "تقرير فترة", "مقارنة الفترات", "الإيراد والربح", "الأكثر مبيعًا", "أداء الفروع"],
    },
  },
  {
    id: "reports-export",
    category: "reports",
    titles: { fa: "گرفتن خروجی و گزارش", en: "Exports and reports", ar: "التصدير والتقارير" },
    answers: {
      fa: `برای گرفتن گزارش:
• فاکتورها ← بازه تاریخ و شعبه را انتخاب کن ← دکمه «خروجی» فایل Excel می‌دهد.
• فاکتور تکی: دکمه PDF روی همان فاکتور.
• مرجوعی: از صفحه «مرجوعی‌ها» دکمه PDF هر رسید.
• آمار کلی: اعداد صفحه «تحلیل» و داشبورد را ببین یا از نمودارها برای گزارش ماهانه استفاده کن.
• اکسل مناسب حسابداری است؛ PDF مناسب چاپ و ارسال به مشتری.
اگر فایل دانلود نشد، پاپ‌آپ مرورگر و مجوز دانلود را چک کن.`,
      en: `To get a report:
• Invoices → choose the date range and branch → Export downloads an Excel file.
• Single invoice: the PDF button on that invoice.
• Refunds: the PDF button on each credit note in Refunds.
• Overall numbers: read them from Analytics and the dashboard, or use the charts for a monthly report.
• Excel is best for accounting; PDF for printing and sending to customers.
If nothing downloads, check the browser's pop-up and download permissions.`,
      ar: `للحصول على تقرير:
• الفواتير → اختر الفترة والفرع → زر «تصدير» ينزل ملف إكسل.
• فاتورة واحدة: زر PDF عليها.
• المرتجعات: زر PDF لكل إشعار في صفحة المرتجعات.
• الأرقام العامة: من صفحة التحليل ولوحة التحكم أو الرسوم لتقرير شهري.
• إكسل مناسب للمحاسبة و PDF للطباعة والإرسال للعملاء.
إذا لم ينزل الملف فتحقق من سماح المتصفح بالنوافذ والتنزيل.`,
    },
    keywords: {
      fa: ["خروجی", "خروجی اکسل", "گزارش اکسل", "گزارش بگیرم", "دانلود اکسل", "گزارش", "اکسل", "دانلود گزارش", "گزارش ماهانه", "حسابداری", "export"],
      en: ["export", "export excel", "excel report", "report", "excel", "download report", "monthly report", "accounting"],
      ar: ["تصدير", "تصدير إكسل", "أصدّر إكسل", "أصدر إكسل", "تقرير إكسل", "تقرير", "إكسل", "تنزيل تقرير", "تقرير شهري", "محاسبة"],
    },
  },
  {
    id: "staff",
    category: "manage",
    titles: { fa: "کارکنان و نقش‌ها", en: "Staff and roles", ar: "الموظفون والأدوار" },
    answers: {
      fa: `در «مدیریت ← کارکنان» صاحب فروشگاه و مدیر شعبه کاربر می‌سازند و نقش می‌دهند.
• نام کامل و نام کاربری (فقط حروف انگلیسی، عدد و _) و رمز حداقل ۶ کاراکتری.
• نقش‌ها: صاحب فروشگاه (همه چیز)، مدیر شعبه (شعبه خودش) و فروشنده (فروش و مشتریان شعبه).
• هر کارمند باید به یک شعبه وصل باشد؛ فروشنده بدون شعبه کار نمی‌کند.
• مدیر شعبه فقط کارمندان شعبه خودش را می‌بیند و ویرایش می‌کند.
• حساب صاحب فروشگاه و حساب خودت قابل حذف نیست.
• برای عوض کردن رمز، همان کاربر را ویرایش کن و رمز جدید بگذار؛ رمز خالی یعنی رمز عوض نشود.`,
      en: `In Manage → Staff the owner and branch managers create users and assign roles.
• Full name, username (letters, numbers and _ only) and a password of at least 6 characters.
• Roles: store owner (everything), branch manager (their branch) and sales person (sales and customers of the branch).
• Every staff member must belong to a branch; a sales person without a branch cannot work.
• A branch manager sees and edits only staff of their own branch.
• The owner account and your own account cannot be deleted.
• To change a password edit that user and set a new one; an empty password leaves it unchanged.`,
      ar: `في «الإدارة ← الموظفون» ينشئ صاحب المتجر ومدير الفرع المستخدمين ويحددون الأدوار.
• الاسم الكامل واسم المستخدم (حروف إنجليزية وأرقام و _ فقط) وكلمة مرور من ٦ أحرف على الأقل.
• الأدوار: صاحب المتجر (كل شيء)، مدير الفرع (فرعه) والمندوب (البيع وعملاء الفرع).
• يجب ربط كل موظف بفرع؛ المندوب بلا فرع لا يستطيع العمل.
• مدير الفرع يرى ويعدّل موظفي فرعه فقط.
• حساب صاحب المتجر وحسابك لا يمكن حذفهما.
• لتغيير كلمة المرور عدّل المستخدم وضع كلمة جديدة؛ الحقل الفارغ يعني عدم التغيير.`,
    },
    keywords: {
      fa: ["کارمند", "کارمند جدید", "افزودن کارمند", "اضافه کردن کارمند", "کارمند اضافه کنم", "نقش", "دسترسی", "فروشنده", "مدیر شعبه", "ساخت کاربر", "مجوز", "رمز کارمند"],
      en: ["staff", "employee", "role", "permission", "sales person", "branch manager", "create user", "staff password"],
      ar: ["موظف", "دور", "صلاحيات", "مندوب", "مدير فرع", "إنشاء مستخدم", "كلمة مرور الموظف"],
    },
  },
  {
    id: "branches",
    category: "manage",
    titles: { fa: "شعبه‌ها، لوگو و شعبه فعال", en: "Branches, logo and active branch", ar: "الفروع والشعار والفرع النشط" },
    answers: {
      fa: `در «مدیریت ← شعبه‌ها» فهرست شعبه‌ها هست:
• شعبه جدید: نام (حداقل ۲ حرف)، آدرس و تلفن را وارد کن.
• صفحه هر شعبه: ویرایش اطلاعات، تب دریافت فاکتور، تب اتصال واتساپ، تب پیام گروهی و تب لوگو.
• لوگو در فاکتور PDF و سربرگ چاپی استفاده می‌شود.
• شعبه اصلی با نشان HQ مشخص است و حذف نمی‌شود.
• با سوییچ شعبه در منو، شعبه فعال را عوض کن؛ فروش، انبار و آمار روی همان شعبه است.
• حذف شعبه فقط وقتی ممکن است که داده وابسته نداشته باشد.`,
      en: `Manage → Branches lists the branches:
• New branch: name (at least 2 characters), address and phone.
• Each branch page has details, receive invoices, WhatsApp connection, bulk messages and logo tabs.
• The logo is used on the PDF invoice and print header.
• The main branch is marked HQ and cannot be deleted.
• Use the branch switch in the menu to change the active branch; sales, inventory and stats follow it.
• A branch can only be deleted when it has no dependent data.`,
      ar: `«الإدارة ← الفروع» تعرض الفروع:
• فرع جديد: الاسم (حرفان على الأقل) والعنوان والهاتف.
• صفحة كل فرع: التفاصيل واستقبال الفواتير وربط واتساب والرسائل الجماعية والشعار.
• يُستخدم الشعار في الفاتورة PDF والترويسة.
• الفرع الرئيسي يحمل شارة HQ ولا يمكن حذفه.
• بدّل الفرع النشط من مبدّل الفرع في القائمة؛ البيع والمخزون والإحصاءات تتبعه.
• لا يمكن حذف فرع لديه بيانات مرتبطة.`,
    },
    keywords: {
      fa: ["شعبه", "شعبه جدید", "افزودن شعبه", "اضافه کردن شعبه", "شعبه اضافه کنم", "لوگو", "لوگو بگذارم", "گذاشتن لوگو", "آپلود لوگو", "انتخاب شعبه", "آدرس شعبه", "شعبه اصلی", "حذف شعبه"],
      en: ["branch", "new branch", "add branch", "create branch", "logo", "upload logo", "change logo", "switch branch", "branch address", "main branch", "delete branch"],
      ar: ["فرع", "فرع جديد", "إضافة فرع", "اضافة فرع", "شعار", "الشعار", "رفع شعار", "أرفع الشعار", "تحميل شعار", "اللوغو", "تبديل الفرع", "عنوان الفرع", "الفرع الرئيسي", "حذف فرع"],
    },
  },
  {
    id: "printing-setup",
    category: "help",
    titles: { fa: "چاپ فاکتور و برچسب", en: "Printing invoices and labels", ar: "طباعة الفواتير والملصقات" },
    answers: {
      fa: `• PDF فاکتور در تب جدید باز می‌شود؛ اگر باز نشد پاپ‌آپ مرورگر را برای سایت اجازه بده.
• در پنجره چاپ، چاپگر را انتخاب کن و مقیاس را روی ۱۰۰٪ بگذار تا ستون‌ها کامل چاپ شوند.
• برای فاکتور A4 و برای برچسب بارکد، برچسب‌چسبان یا چاپگر لیبل انتخاب کن.
• اگر متن بریده می‌شود، حاشیه چاپ را کم کن یا «Fit to page» را بزن.
• برای ارسال به مشتری، PDF را دانلود کن و با واتساپ بفرست.
• زبان فاکتور همان زبان سایت است؛ قبل از چاپ زبان را چک کن.`,
      en: `• The invoice PDF opens in a new tab; if it does not, allow pop-ups for the site.
• In the print dialog pick the printer and keep the scale at 100% so all columns fit.
• Use A4 for invoices and a label sheet or label printer for barcode labels.
• If text is cut off, reduce the print margins or use Fit to page.
• To send it to a customer, download the PDF and send it on WhatsApp.
• The invoice language follows the site language, so check it before printing.`,
      ar: `• تفتح الفاتورة PDF في تبويب جديد؛ وإن لم يفتح فاسمح بالنوافذ المنبثقة.
• في نافذة الطباعة اختر الطابعة واجعل المقياس ١٠٠٪ لتظهر كل الأعمدة.
• استخدم A4 للفواتير وورق ملصقات أو طابعة ملصقات للباركود.
• إذا انقطع النص فقلل هوامش الطباعة أو استخدم Fit to page.
• لإرسالها للعميل نزّل PDF وأرسله بواتساب.
• لغة الفاتورة تتبع لغة الموقع، فتحقق منها قبل الطباعة.`,
    },
    keywords: {
      fa: ["چاپ", "چاپگر", "پرینتر", "پاپ آپ", "PDF باز نمی‌شود", "برچسب چاپ", "کاغذ A4", "متن بریده می‌شود"],
      en: ["print", "printer", "pop-up", "pdf not opening", "print label", "a4", "text cut off"],
      ar: ["طباعة", "طابعة", "نافذة منبثقة", "PDF لا يفتح", "طباعة ملصق", "A4", "النص مقطوع"],
    },
  },
  {
    id: "daily-checklist",
    category: "help",
    titles: { fa: "روتین روزانه فروشگاه", en: "Daily store routine", ar: "روتين المتجر اليومي" },
    answers: {
      fa: `شروع روز:
• شعبه فعال را چک کن و مطمئن شو واتساپ شعبه متصل است.
• موجودی پارچه‌های کم را ببین و اگر لازم است سفارش بده.
در طول روز:
• هر فروش را همان لحظه ثبت کن، نه آخر روز.
• مشتری جدید را با تلفن درست ثبت کن تا ارسال فاکتور ساده باشد.
• مرجوعی را از روی فاکتور اصلی ثبت کن تا انبار و حساب درست بماند.
پایان روز:
• لیست فاکتورهای امروز را با صندوق مقایسه کن.
• خروجی اکسل روز را بگیر و ذخیره کن.
• اختلاف یا اشتباه را با مرجوعی اصلاح کن، نه با حذف فاکتور.`,
      en: `Start of day:
• Check the active branch and that the branch WhatsApp is connected.
• Look at low-stock fabrics and reorder if needed.
During the day:
• Record each sale immediately, not at closing time.
• Save new customers with the correct phone so invoices are easy to send.
• Record refunds from the original invoice so stock and accounts stay correct.
End of day:
• Compare today's invoice list with the cash drawer.
• Export today's Excel report and keep it.
• Fix mistakes with a refund instead of deleting invoices.`,
      ar: `بداية اليوم:
• تحقق من الفرع النشط ومن اتصال واتساب الفرع.
• راجع الأقمشة منخفضة المخزون واطلب إن لزم.
خلال اليوم:
• سجّل كل بيع فورًا لا في نهاية اليوم.
• أدخل العميل الجديد برقم هاتف صحيح لتسهيل إرسال الفواتير.
• سجّل المرتجع من الفاتورة الأصلية ليبقى المخزون والحساب صحيحين.
نهاية اليوم:
• قارن قائمة فواتير اليوم مع الصندوق.
• صدّر تقرير إكسل واحفظه.
• صحّح الأخطاء بمرتجع لا بحذف الفواتير.`,
    },
    keywords: {
      fa: ["روتین", "کارهای روزانه", "پایان روز", "صندوق", "بستن روز", "چک لیست روزانه"],
      en: ["routine", "daily tasks", "end of day", "cash drawer", "closing", "checklist"],
      ar: ["روتين", "مهام يومية", "نهاية اليوم", "الصندوق", "إغلاق اليوم", "قائمة تحقق"],
    },
  },
  {
    id: "account-security",
    category: "help",
    titles: { fa: "امنیت حساب و دسترسی", en: "Account security", ar: "أمان الحساب" },
    answers: {
      fa: `• برای هر کارمند حساب جدا بساز و رمز را با او به اشتراک نگذار.
• رمز حساب صاحب فروشگاه را فقط صاحب فروشگاه بداند؛ کار روزمره با حساب فروشنده یا مدیر انجام شود.
• روی کامپیوتر مشترک، بعد از کار از حساب خارج شو.
• رمزها را جایی کنار کامپیوتر ننویس.
• اگر کارمندی از فروشگاه رفت، حسابش را از «مدیریت ← کارکنان» حذف یا رمزش را عوض کن.
• پشتیبانی هرگز رمز عبور تو را نمی‌پرسد؛ رمز را برای هیچ‌کس نفرست.`,
      en: `• Give every staff member their own account and never share passwords.
• Only the owner should know the owner password; daily work should use sales or manager accounts.
• On a shared computer sign out when you finish.
• Do not write passwords on a note next to the computer.
• When a staff member leaves, delete their account in Manage → Staff or change the password.
• Support never asks for your password; never send it to anyone.`,
      ar: `• أنشئ حسابًا مستقلًا لكل موظف ولا تشارك كلمات المرور.
• كلمة مرور صاحب المتجر يعرفها صاحب المتجر فقط، والعمل اليومي بحساب المندوب أو المدير.
• على جهاز مشترك سجّل الخروج بعد الانتهاء.
• لا تكتب كلمات المرور على ورقة بجانب الجهاز.
• عند مغادرة موظف احذف حسابه من «الإدارة ← الموظفون» أو غيّر كلمته.
• الدعم لا يطلب كلمة المرور أبدًا؛ لا ترسلها لأي أحد.`,
    },
    keywords: {
      fa: ["امنیت", "رمز", "خروج از حساب", "اشتراک رمز", "کاربر حذف", "دسترسی کارمند", "رمز را فراموش"],
      en: ["security", "password", "logout", "share password", "remove user", "staff access"],
      ar: ["أمان", "كلمة المرور", "تسجيل الخروج", "مشاركة كلمة المرور", "حذف مستخدم", "صلاحيات الموظف"],
    },
  },
  {
    id: "troubleshooting",
    category: "help",
    titles: { fa: "مشکل‌های رایج", en: "Common problems", ar: "مشكلات شائعة" },
    answers: {
      fa: `• صفحه سفید یا خطا: صفحه را رفرش کن و از منو دوباره باز کن؛ اگر ادامه داشت با پشتیبانی تماس بگیر.
• کندی: تعداد تب‌های باز مرورگر را کم کن و صفحه را دوباره باز کن.
• PDF باز نمی‌شود: پاپ‌آپ مرورگر را اجازه بده یا از صفحه فاکتورها دوباره بگیر.
• عدد یا تاریخ اشتباه: بازه تاریخ و شعبه فعال را چک کن.
• «دسترسی ندارید»: نقش کاربر این صفحه را نمی‌بیند؛ با حساب مناسب وارد شو.
• تغییری ذخیره نمی‌شود: فیلدهای اجباری را پر کن و پیام خطای بالای فرم را بخوان.
• اگر سؤالت اینجا نبود به پشتیبانی بگو تا به راهنما اضافه شود.`,
      en: `• White page or error: refresh and reopen the page from the menu; if it continues contact support.
• Slow: close extra browser tabs and reopen the page.
• PDF does not open: allow pop-ups, or download it again from the Invoices page.
• Wrong numbers or dates: check the date range and the active branch.
• Access denied: the user role cannot open that page; sign in with the right account.
• Changes not saving: fill the required fields and read the error message above the form.
• If your question is not here, tell support so it can be added to this guide.`,
      ar: `• صفحة بيضاء أو خطأ: حدّث الصفحة وافتحها من القائمة مجددًا، وإن استمر فأبلغ الدعم.
• البطء: أغلق تبويبات المتصفح الزائدة وأعد فتح الصفحة.
• الفاتورة PDF لا تفتح: اسمح بالنوافذ المنبثقة أو نزّلها من صفحة الفواتير.
• أرقام أو تواريخ خاطئة: تحقق من نطاق التاريخ والفرع النشط.
• «لا تملك صلاحية»: دور المستخدم لا يفتح هذه الصفحة؛ سجّل بحساب مناسب.
• لا يتم الحفظ: املأ الحقول المطلوبة واقرأ رسالة الخطأ أعلى النموذج.
• إذا لم تجد سؤالك فأبلغ الدعم لإضافته إلى الدليل.`,
    },
    keywords: {
      fa: ["مشکل", "خطا", "صفحه سفید", "کار نمی‌کند", "باگ", "کندی", "دسترسی ندارید", "ذخیره نمی‌شود", "عکس آپلود", "اسکن کارت"],
      en: ["problem", "error", "white page", "not working", "bug", "slow", "access denied", "not saving", "upload image", "id scan"],
      ar: ["مشكلة", "خطأ", "صفحة بيضاء", "لا يعمل", "بطيء", "لا تملك صلاحية", "لا يتم الحفظ", "رفع صورة", "مسح البطاقة"],
    },
  },
];
