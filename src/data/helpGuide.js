// راهنمای کاربری KuwaitQumash در سه زبان.
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
    open: "راهنمای استفاده از سایت",
    placeholder: "سوالت را بنویس، مثلاً: چطور فروش ثبت کنم؟",
    send: "ارسال",
    close: "بستن",
    clear: "گفتگوی جدید",
    greeting:
      "سلام! من دستیار راهنمای KuwaitQumash هستم. هر سؤالی درباره فروش، انبار، مرجوعی، مشتری، فاکتور و اتصال واتساپ داری بپرس؛ به همان زبانی که می‌نویسی جواب می‌دهم.",
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
    open: "How to use the site",
    placeholder: "Type your question, e.g. how do I record a sale?",
    send: "Send",
    close: "Close",
    clear: "New chat",
    greeting:
      "Hi! I am the KuwaitQumash help assistant. Ask me anything about sales, inventory, refunds, customers, invoices or connecting WhatsApp. I reply in the language you type.",
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
    open: "طريقة استخدام الموقع",
    placeholder: "اكتب سؤالك، مثال: كيف أسجل عملية بيع؟",
    send: "إرسال",
    close: "إغلاق",
    clear: "محادثة جديدة",
    greeting:
      "مرحبًا! أنا مساعد دليل KuwaitQumash. اسألني عن البيع، المخزون، المرتجعات، العملاء، الفواتير أو ربط واتساب. سأجيب باللغة التي تكتب بها.",
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
    titles: {
      fa: "ورود به سایت",
      en: "Signing in",
      ar: "تسجيل الدخول",
    },
    answers: {
      fa: "نام کاربری و رمز عبوری که مدیر فروشگاه برایت ساخته را در صفحه ورود بزن.\n• هر کاربر نقشی دارد: صاحب فروشگاه، مدیر شعبه یا فروشنده.\n• اگر رمز را فراموش کردی، از صاحب فروشگاه یا مدیر بخواه رمز را عوض کند.\n• بعد از ورود، شعبه فعال را از بالای منو انتخاب کن.",
      en: "Enter the username and password your store owner created for you on the login screen.\n• Each user has a role: store owner, branch manager or sales person.\n• Forgot the password? Ask the store owner or manager to reset it.\n• After signing in, pick the active branch from the sidebar.",
      ar: "أدخل اسم المستخدم وكلمة المرور التي أنشأها لك صاحب المتجر في صفحة الدخول.\n• لكل مستخدم دور: صاحب المتجر أو مدير الفرع أو مندوب بيع.\n• إذا نسيت كلمة المرور فاطلب من صاحب المتجر تغييرها.\n• بعد الدخول اختر الفرع النشط من القائمة الجانبية.",
    },
    keywords: {
      fa: ["ورود", "لاگین", "وارد شدن", "رمز عبور", "نام کاربری", "حساب", "پسورد", "ورود نمیکند", "نمی‌توانم وارد شوم"],
      en: ["login", "sign in", "log in", "password", "username", "account", "cannot login", "forgot password"],
      ar: ["دخول", "تسجيل الدخول", "كلمة المرور", "اسم المستخدم", "حساب", "لا أستطيع الدخول"],
    },
  },
  {
    id: "language-theme",
    category: "basic",
    titles: {
      fa: "تغییر زبان و تم",
      en: "Changing language and theme",
      ar: "تغيير اللغة والمظهر",
    },
    answers: {
      fa: "در نوار بالا دکمه زبان (FA/EN/AR) را بزن و از منو فارسی، English یا العربية را انتخاب کن؛ کل سایت و فاکتورهای چاپی هم همان زبان می‌شوند.\n• دکمه خورشید/ماه حالت روشن و تاریک را عوض می‌کند.\n• ترتیب دکمه‌ها در حالت فارسی و عربی راست‌چین می‌شود.",
      en: "Tap the language button (FA/EN/AR) in the top bar and choose Farsi, English or Arabic; the whole app and printed invoices follow that language.\n• The sun/moon button switches light and dark mode.\n• In Farsi and Arabic the layout flips to right-to-left.",
      ar: "اضغط زر اللغة (FA/EN/AR) في الشريط العلوي واختر الفارسية أو الإنجليزية أو العربية؛ يتغير الموقع والفواتير المطبوعة.\n• زر الشمس/القمر يبدل بين الوضع الفاتح والداكن.\n• في الفارسية والعربية يصبح الاتجاه من اليمين إلى اليسار.",
    },
    keywords: {
      fa: ["زبان", "تغییر زبان", "فارسی", "انگلیسی", "عربی", "تم", "حالت تاریک", "حالت روشن", "راست چین"],
      en: ["language", "change language", "english", "arabic", "persian", "theme", "dark mode", "light mode", "rtl"],
      ar: ["اللغة", "تغيير اللغة", "العربية", "الإنجليزية", "المظهر", "الوضع الداكن", "الوضع الفاتح"],
    },
  },
  {
    id: "dashboard",
    category: "basic",
    titles: {
      fa: "داشبورد و آمار فروش",
      en: "Dashboard and sales stats",
      ar: "لوحة التحكم وإحصاءات البيع",
    },
    answers: {
      fa: "صفحه داشبورد خلاصه فروش، سود، تعداد فاکتور، پارچه‌های پرفروش و نمودار درآمد را نشان می‌دهد.\n• با انتخاب شعبه، آمار همان شعبه فیلتر می‌شود.\n• صاحب فروشگاه آمار همه شعبه‌ها را می‌بیند؛ فروشنده فقط شعبه خودش را.",
      en: "The dashboard shows sales, profit, invoice count, best-selling fabrics and revenue charts.\n• Choosing a branch filters the numbers to that branch.\n• Store owners see every branch; sales staff see only their own branch.",
      ar: "تعرض لوحة التحكم المبيعات والأرباح وعدد الفواتير والأقمشة الأكثر مبيعًا والرسوم البيانية.\n• اختيار فرع يصفّي الأرقام لذلك الفرع.\n• صاحب المتجر يرى كل الفروع، والمندوب يرى فرعه فقط.",
    },
    keywords: {
      fa: ["داشبورد", "آمار", "گزارش فروش", "سود", "نمودار", "پرفروش", "درآمد"],
      en: ["dashboard", "stats", "statistics", "report", "profit", "chart", "best selling", "revenue"],
      ar: ["لوحة التحكم", "إحصاءات", "تقرير", "أرباح", "رسم بياني", "الأكثر مبيعًا", "الإيرادات"],
    },
  },
  {
    id: "inventory-list",
    category: "inventory",
    titles: {
      fa: "جست‌وجو و فیلتر انبار",
      en: "Searching and filtering inventory",
      ar: "البحث والتصفية في المخزون",
    },
    answers: {
      fa: "در صفحه «انبار پارچه» همه طاقه‌ها با نام، نوع پارچه، طرح، رنگ، طول، تعداد، قیمت خرید، ارزش و سود فهرست می‌شوند.\n• با کادر جست‌وجو نام یا بارکد را بزن.\n• فیلترهای نوع پارچه، طرح و وضعیت (موجود / تمام‌شده) را از بالای جدول انتخاب کن.\n• روی هر ردیف کلیک کنی، جزئیات قلم باز می‌شود.",
      en: "On the Inventory page every roll is listed with name, fabric type, pattern, colour, length, quantity, cost, value and profit.\n• Use the search box for a name or barcode.\n• Filter by fabric type, pattern and stock status (In Stock / Out of Stock) above the table.\n• Click a row to open the item details.",
      ar: "في صفحة مخزون الأقمشة تُعرض كل الطاقات بالاسم ونوع القماش والنقشة واللون والطول والكمية والتكلفة والقيمة والربح.\n• استخدم مربع البحث بالاسم أو الباركود.\n• صفِّ حسب نوع القماش والنقشة والحالة (متوفر / منتهي) أعلى الجدول.\n• اضغط على الصف لعرض تفاصيل الصنف.",
    },
    keywords: {
      fa: ["انبار", "پارچه", "جست‌وجو", "فیلتر", "موجودی", "طاقه", "بارکد", "لیست پارچه"],
      en: ["inventory", "fabric list", "search", "filter", "stock", "roll", "barcode"],
      ar: ["مخزون", "أقمشة", "بحث", "تصفية", "كمية", "طاقة", "باركود"],
    },
  },
  {
    id: "inventory-add",
    category: "inventory",
    titles: {
      fa: "افزودن پارچه جدید",
      en: "Adding a new fabric",
      ar: "إضافة قماش جديد",
    },
    answers: {
      fa: "در صفحه انبار دکمه «افزودن پارچه» را بزن و فرم را پر کن:\n• بارکد (می‌توانی با اسکنر پر کنی)، نام قلم، نوع پارچه، طرح، رنگ، ترکیب.\n• عرض به سانتی‌متر، طول طاقه به متر، تعداد، واحد (متر / طاقه / عدد).\n• قیمت خرید هر متر، قیمت فروش هر متر و حداقل موجودی.\n• شعبه‌ای که پارچه در آن است.\nبا ذخیره، قلم در انبار همان شعبه ثبت می‌شود.",
      en: "On the Inventory page press “Add fabric” and fill the form:\n• Barcode (you can scan it), item name, fabric type, pattern, colour, composition.\n• Width in cm, roll length in meters, quantity, unit (meter / roll / piece).\n• Cost per meter, selling price per meter and minimum stock.\n• The branch that holds the fabric.\nSaving adds the item to that branch's inventory.",
      ar: "في صفحة المخزون اضغط «إضافة قماش» واملأ النموذج:\n• الباركود (يمكن مسحه)، اسم الصنف، نوع القماش، النقشة، اللون، التركيب.\n• العرض بالسنتيمتر، طول الطاقة بالمتر، الكمية، الوحدة (متر/طاقة/قطعة).\n• سعر الشراء للمتر، سعر البيع للمتر والحد الأدنى للمخزون.\n• الفرع الذي يوجد فيه القماش.\nبعد الحفظ يُسجَّل الصنف في مخزون ذلك الفرع.",
    },
    keywords: {
      fa: ["افزودن پارچه", "پارچه جدید", "ثبت پارچه", "اضافه کردن پارچه", "قیمت خرید", "قیمت فروش", "عرض", "طول طاقه", "موجودی اولیه"],
      en: ["add fabric", "new fabric", "add item", "create fabric", "cost price", "selling price", "width", "roll length", "min stock"],
      ar: ["إضافة قماش", "قماش جديد", "إضافة صنف", "سعر الشراء", "سعر البيع", "العرض", "طول الطاقة"],
    },
  },
  {
    id: "inventory-item",
    category: "inventory",
    titles: {
      fa: "ویرایش و حذف پارچه",
      en: "Editing and deleting a fabric",
      ar: "تعديل وحذف القماش",
    },
    answers: {
      fa: "روی قلم در انبار کلیک کن تا صفحه جزئیات باز شود؛ از دکمه «ویرایش» مقادیر را عوض کن و ذخیره بزن.\n• دکمه «حذف» قلم را از انبار برمی‌دارد؛ اگر روی آن فاکتور خورده باشد سیستم اجازه نمی‌دهد و باید به‌جای حذف موجودی را صفر کنی.\n• دکمه چاپ، برچسب بارکد قلم را برای چسباندن روی طاقه چاپ می‌کند.",
      en: "Click an inventory row to open item details; use “Edit” to change values and save.\n• “Delete” removes the item from inventory. If it was already sold on an invoice the system blocks deletion, so set its quantity to zero instead.\n• The print button produces a barcode label for the roll.",
      ar: "اضغط على الصنف في المخزون لتفتح التفاصيل، ثم «تعديل» لتغيير القيم والحفظ.\n• زر «حذف» يزيل الصنف من المخزون، وإذا كان مرتبطًا بفاتورة يمنع النظام الحذف، فاجعل الكمية صفرًا.\n• زر الطباعة يطبع ملصق باركود للطاقة.",
    },
    keywords: {
      fa: ["ویرایش پارچه", "حذف پارچه", "تغییر قیمت پارچه", "برچسب بارکد", "چاپ بارکد", "جزئیات قلم"],
      en: ["edit fabric", "delete fabric", "change price", "barcode label", "print barcode", "item details"],
      ar: ["تعديل قماش", "حذف قماش", "تغيير السعر", "ملصق باركود", "طباعة باركود", "تفاصيل الصنف"],
    },
  },
  {
    id: "customers-add",
    category: "customers",
    titles: {
      fa: "افزودن مشتری جدید",
      en: "Adding a customer",
      ar: "إضافة عميل جديد",
    },
    answers: {
      fa: "در صفحه «مشتریان» دکمه «مشتری جدید» را بزن و فقط این‌ها را پر کن:\n• نام، شماره تلفن، جنسیت (مرد/زن)، آدرس.\n• نوع مشتری: Regular (عادی)، VIP یا Wholesaler (عمده‌فروش).\n• یادداشت (اختیاری) برای هر نکته‌ای که لازم داری.\nشماره کارت شناسایی یا ملی لازم نیست. همین فرم در صفحه فروش هم با دکمه + کنار جست‌وجوی مشتری باز می‌شود.",
      en: "On the Customers page press “New customer” and fill only these:\n• Name, phone, gender (male/female), address.\n• Customer type: Regular, VIP or Wholesaler.\n• Notes (optional) for anything you want to remember.\nNo national or civil ID card is required. The same form opens from the + button next to customer search on the Sales page.",
      ar: "في صفحة العملاء اضغط «عميل جديد» واملأ فقط:\n• الاسم، رقم الهاتف، الجنس (ذكر/أنثى)، العنوان.\n• نوع العميل: Regular أو VIP أو Wholesaler (جملة).\n• ملاحظات (اختياري).\nلا حاجة لبطاقة الهوية أو الرقم المدني. نفس النموذج يفتح من زر + بجانب بحث العملاء في صفحة البيع.",
    },
    keywords: {
      fa: ["مشتری جدید", "افزودن مشتری", "ثبت مشتری", "شماره تلفن مشتری", "نوع مشتری", "وی‌آی‌پی", "عمده فروش", "کارت شناسایی مشتری"],
      en: ["add customer", "new customer", "customer type", "vip", "wholesaler", "phone", "customer id card"],
      ar: ["إضافة عميل", "عميل جديد", "نوع العميل", "جملة", "هاتف", "بطاقة العميل"],
    },
  },
  {
    id: "customers-manage",
    category: "customers",
    titles: {
      fa: "مدیریت و سابقه مشتری",
      en: "Managing customers and history",
      ar: "إدارة العملاء والسجل",
    },
    answers: {
      fa: "در لیست مشتریان می‌توانی با نام، تلفن یا آدرس جست‌وجو کنی، ویرایش یا حذف کنی.\n• مشتری که فاکتور دارد حذف نمی‌شود.\n• با کلیک روی مشتری، صفحه او باز می‌شود: مجموع خرید، تعداد تراکنش، آخرین مراجعه، پارچه و طرح مورد علاقه و سابقه فاکتورها با دکمه PDF.",
      en: "In the customer list you can search by name, phone or address, and edit or delete customers.\n• A customer with invoices cannot be deleted.\n• Clicking a customer opens their page: total spent, transaction count, last visit, favourite fabric and pattern, and invoice history with a PDF button.",
      ar: "في قائمة العملاء يمكنك البحث بالاسم أو الهاتف أو العنوان، والتعديل أو الحذف.\n• لا يمكن حذف عميل لديه فواتير.\n• بالضغط على العميل تُفتح صفحته: إجمالي الشراء، عدد العمليات، آخر زيارة، القماش والنقشة المفضلة وسجل الفواتير مع زر PDF.",
    },
    keywords: {
      fa: ["لیست مشتریان", "سابقه مشتری", "حذف مشتری", "ویرایش مشتری", "خرید مشتری", "جست‌وجوی مشتری"],
      en: ["customer list", "customer history", "delete customer", "edit customer", "customer purchases", "search customer"],
      ar: ["قائمة العملاء", "سجل العميل", "حذف عميل", "تعديل عميل", "مشتريات العميل", "بحث عن عميل"],
    },
  },
  {
    id: "sales",
    category: "sales",
    titles: {
      fa: "ثبت فروش",
      en: "Recording a sale",
      ar: "تسجيل عملية بيع",
    },
    answers: {
      fa: "۱) از منو «فروش» را باز کن و شعبه فعال را چک کن.\n۲) مشتری را از کادر جست‌وجو انتخاب کن یا با + مشتری جدید بساز.\n۳) پارچه را با نام یا بارکد جست‌وجو و به سبد اضافه کن (دکمه اسکن هم دارد).\n۴) در هر ردیف متراژ، تعداد، قیمت هر متر و تخفیف را وارد کن؛ جمع ردیف خودکار حساب می‌شود.\n۵) روش پرداخت (نقد، K-Net، ویزا/مستر، لینک، چک) و مبلغ را بزن. اگر چند روش داری، روش دیگری اضافه کن تا مانده صفر شود.\n۶) دکمه «تکمیل فروش» را بزن؛ فاکتور ساخته می‌شود و پنجره چاپ/واتساپ باز می‌شود.",
      en: "1) Open Sales from the menu and confirm the active branch.\n2) Pick the customer from the search box, or use + to create one.\n3) Search the fabric by name or barcode and add it to the cart (there is also a scan button).\n4) In each row set meters, quantity, price per meter and discount; the line total is calculated for you.\n5) Choose the payment method (Cash, K-Net, Visa/Master, Link, Cheque) and the amount. Add another method if the payment is split until the remaining is zero.\n6) Press “Complete sale”; the invoice is created and the print/WhatsApp dialog opens.",
      ar: "١) افتح «البيع» من القائمة وتأكد من الفرع النشط.\n٢) اختر العميل من مربع البحث أو أنشئ عميلًا جديدًا بزر +.\n٣) ابحث عن القماش بالاسم أو الباركود وأضفه إلى السلة (يوجد زر مسح).\n٤) في كل سطر أدخل الأمتار والكمية وسعر المتر والخصم، ويُحسب الإجمالي تلقائيًا.\n٥) اختر طريقة الدفع (نقدًا، K-Net، فيزا/ماستر، رابط، شيك) وأدخل المبلغ، وأضف طريقة أخرى إذا كان الدفع مقسمًا حتى يصبح المتبقي صفرًا.\n٦) اضغط «إتمام البيع» لتُنشأ الفاتورة وتُفتح نافذة الطباعة/واتساب.",
    },
    keywords: {
      fa: ["فروش", "ثبت فروش", "فاکتور فروش", "بفروشم", "می‌خواهم بفروشم", "سبد خرید", "اضافه کردن به سبد", "تخفیف", "پرداخت", "تکمیل فروش", "متراژ", "بارکد اسکن"],
      en: ["sale", "sell", "record sale", "cart", "add to cart", "discount", "payment", "complete sale", "meters", "scan barcode"],
      ar: ["بيع", "تسجيل بيع", "سلة", "إضافة إلى السلة", "خصم", "دفع", "إتمام البيع", "أمتار", "مسح باركود"],
    },
  },
  {
    id: "invoices",
    category: "sales",
    titles: {
      fa: "فاکتورها و چاپ PDF",
      en: "Invoices and PDF printing",
      ar: "الفواتير وطباعة PDF",
    },
    answers: {
      fa: "صفحه «فاکتورها» همه فاکتورهای شعبه را با شماره، تاریخ، مشتری و مبلغ نشان می‌دهد.\n• با تاریخ یا شماره فاکتور جست‌وجو کن.\n• دکمه PDF فاکتور را در تب جدید باز می‌کند؛ از آنجا چاپ یا ذخیره کن.\n• دکمه «خروجی» گزارش بازه تاریخی را در فایل Excel می‌دهد.\nفاکتور شامل نام و تلفن مشتری، آدرس، نوع مشتری، نوع پارچه، متراژ، قیمت هر متر، تخفیف، جمع کل به دینار، روش پرداخت، مجموع متراژ، فرم هدف خرید و شرایط پارچه است.",
      en: "The Invoices page lists every invoice with number, date, customer and amount.\n• Filter by date or search by invoice number.\n• The PDF button opens the invoice in a new tab for printing or saving.\n• “Export” downloads the selected date range as an Excel file.\nThe invoice contains customer name, phone, address, customer type, fabric type, meters, price per meter, discount, grand total in KWD, payment methods, total meters, the purchase purpose form and the fabric terms.",
      ar: "تعرض صفحة الفواتير كل فواتير الفرع مع الرقم والتاريخ والعميل والمبلغ.\n• صفِّ بالتاريخ أو ابحث برقم الفاتورة.\n• زر PDF يفتح الفاتورة في تبويب جديد للطباعة أو الحفظ.\n• زر «تصدير» ينزل تقرير الفترة كملف Excel.\nتشمل الفاتورة اسم العميل وهاتفه وعنوانه ونوعه، نوع القماش، الأمتار، سعر المتر، الخصم، الإجمالي بالدينار، طرق الدفع، مجموع الأمتار، نموذج الغرض من الشراء وشروط الأقمشة.",
    },
    keywords: {
      fa: ["فاکتور", "فاکتورها", "PDF", "چاپ فاکتور", "دانلود فاکتور", "اکسل", "خروجی", "گزارش فاکتور", "فاکتور نمی‌آید"],
      en: ["invoice", "invoices", "pdf", "print invoice", "download invoice", "excel", "export", "invoice report"],
      ar: ["فاتورة", "فواتير", "PDF", "طباعة الفاتورة", "تنزيل الفاتورة", "إكسل", "تصدير", "تقرير الفواتير"],
    },
  },
  {
    id: "refund",
    category: "refunds",
    titles: {
      fa: "ثبت مرجوعی",
      en: "Creating a refund",
      ar: "إنشاء مرتجع",
    },
    answers: {
      fa: "۱) از منو «مرجوعی‌ها» را باز کن.\n۲) شماره یا شناسه فاکتور را وارد کن و دکمه جست‌وجو را بزن.\n۳) از اقلام فاکتور، هر قلم و تعدادی که برگشت می‌خورد را انتخاب کن.\n۴) روش پرداخت برگشت (نقد، K-Net، …) و مبلغ را بزن؛ جمع پرداخت‌ها باید با مبلغ مرجوعی برابر باشد.\n۵) دکمه ثبت را بزن؛ برای فاکتور، «رسید مرجوعی» (Credit Note) با شماره خودش صادر می‌شود و از همان صفحه PDF آن را چاپ کن.\nهمچنین از صفحه فاکتورها روی هر فاکتور دکمه «مرجوعی» هست که همین صفحه را با فاکتور پر می‌کند.",
      en: "1) Open Refunds from the menu.\n2) Enter the invoice number or ID and press search.\n3) Select the items and quantities being returned.\n4) Choose the refund method (Cash, K-Net, …) and amount; the refund payments must equal the refund total.\n5) Press submit. A credit note is issued with its own number and can be printed as PDF from that page.\nFrom the Invoices page there is also a “Refund” button per invoice that opens this page pre-filled.",
      ar: "١) افتح «المرتجعات» من القائمة.\n٢) أدخل رقم الفاتورة أو معرفها واضغط البحث.\n٣) اختر الأصناف والكميات المرتجعة.\n٤) اختر طريقة الإرجاع (نقدًا، K-Net، …) والمبلغ، ويجب أن يتساوى مجموع المدفوعات مع مبلغ المرتجع.\n٥) اضغط إرسال ليصدر إشعار دائن برقم خاص، ويمكن طباعته PDF من نفس الصفحة.\nمن صفحة الفواتير يوجد زر «مرتجع» لكل فاتورة يفتح نفس الصفحة معبأة.",
    },
    keywords: {
      fa: ["مرجوعی", "مرجوع", "برگشت کالا", "پس دادن", "کریدیت نوت", "رسید مرجوعی", "لغو فاکتور", "پول برگشت"],
      en: ["refund", "refunds", "return item", "credit note", "money back", "cancel invoice", "return fabric"],
      ar: ["مرتجع", "إرجاع", "إشعار دائن", "استرداد المال", "إلغاء فاتورة", "إرجاع قماش"],
    },
  },
  {
    id: "whatsapp-connect",
    category: "whatsapp",
    titles: {
      fa: "اتصال واتساپ فروشگاه",
      en: "Connecting the store WhatsApp",
      ar: "ربط واتساب المتجر",
    },
    answers: {
      fa: "این کار فقط با نقش صاحب فروشگاه انجام می‌شود.\n۱) از منو «مدیریت» را باز کن و روی شعبه بزن.\n۲) تب «اتصال واتساپ» را انتخاب کن و دکمه اتصال را بزن تا QR ظاهر شود.\n۳) در گوشی، واتساپ را باز کن → Settings → Linked devices → Link a device و QR را اسکن کن.\n۴) چند ثانیه صبر کن؛ وضعیت باید «متصل» (CONNECTED) شود. صفحه هر ۹۰ ثانیه وضعیت را به‌روز می‌کند.\nبرای قطع اتصال، همان صفحه دکمه جدا کردن دارد.",
      en: "Only the store owner can do this.\n1) Open Manage from the menu and select the branch.\n2) Choose the “Connect WhatsApp” tab and press connect to get the QR code.\n3) On the phone open WhatsApp → Settings → Linked devices → Link a device and scan the QR.\n4) Wait a few seconds; the status must become CONNECTED. The page refreshes the status every 90 seconds.\nThe same page has a disconnect button.",
      ar: "هذه الخطوة لصاحب المتجر فقط.\n١) افتح «الإدارة» من القائمة واختر الفرع.\n٢) اختر تبويب «ربط واتساب» واضغط زر الربط ليظهر رمز QR.\n٣) في الهاتف افتح واتساب → الإعدادات → الأجهزة المرتبطة → ربط جهاز وامسح الرمز.\n٤) انتظر ثوانٍ حتى تصبح الحالة متصلًا (CONNECTED)، والصفحة تحدّث الحالة كل ٩٠ ثانية.\nوفي نفس الصفحة زر لفصل الاتصال.",
    },
    keywords: {
      fa: ["واتساپ", "اتصال واتساپ", "وصل کردن واتساپ", "نصب واتساپ", "QR", "کیو آر", "اسکن واتساپ", "دستگاه‌های متصل", "قطع واتساپ"],
      en: ["whatsapp", "connect whatsapp", "whatsapp setup", "install whatsapp", "qr", "scan qr", "linked devices", "disconnect whatsapp"],
      ar: ["واتساب", "ربط واتساب", "تثبيت واتساب", "رمز QR", "مسح الرمز", "الأجهزة المرتبطة", "فصل واتساب"],
    },
  },
  {
    id: "whatsapp-send",
    category: "whatsapp",
    titles: {
      fa: "فرستادن فاکتور با واتساپ",
      en: "Sending invoices on WhatsApp",
      ar: "إرسال الفواتير عبر واتساب",
    },
    answers: {
      fa: "اول باید واتساپ شعبه متصل باشد.\n• صاحب فروشگاه در صفحه شعبه، گزینه «ارسال فاکتور به مشتری» را روشن می‌کند تا کارکنان بتوانند فاکتور بفرستند.\n• در صفحه فروش بعد از تکمیل فروش، یا در صفحه فاکتورها، دکمه واتساپ را بزن؛ می‌توانی شماره مشتری را تأیید یا عوض کنی.\n• اگر شماره مشتری ثبت نشده باشد، همان‌جا وارد کن.\nهمچنین صاحب فروشگاه می‌تواند شماره‌ای تعیین کند که نسخه‌ای از هر فاکتور خودکار برای او فرستاده شود.",
      en: "The branch WhatsApp must be connected first.\n• The store owner turns on “Send invoice to customer via WhatsApp” on the branch page so staff are allowed to send.\n• After completing a sale, or from the Invoices page, press the WhatsApp button; you can confirm or change the customer number.\n• If the customer has no phone saved, enter it there.\nThe owner can also set a number that automatically receives a copy of every invoice.",
      ar: "يجب ربط واتساب الفرع أولًا.\n• صاحب المتجر يفعّل «إرسال الفاتورة إلى العميل» في صفحة الفرع ليسمح للموظفين بالإرسال.\n• بعد إتمام البيع أو من صفحة الفواتير اضغط زر واتساب، ويمكنك تأكيد رقم العميل أو تغييره.\n• إذا لم يكن للعميل رقم، أدخله هنا.\nويمكن لصاحب المتجر تحديد رقم يصله نسخة تلقائية من كل فاتورة.",
    },
    keywords: {
      fa: ["ارسال فاکتور", "فاکتور واتساپ", "واتساپ مشتری", "شماره واتساپ", "نسخه فروشگاه", "پیام واتساپ"],
      en: ["send invoice", "invoice whatsapp", "customer whatsapp", "whatsapp number", "send pdf whatsapp", "store copy"],
      ar: ["إرسال فاتورة", "فاتورة واتساب", "واتساب العميل", "رقم واتساب", "نسخة المتجر"],
    },
  },
  {
    id: "whatsapp-troubleshoot",
    category: "whatsapp",
    titles: {
      fa: "واتساپ وصل نمی‌شود",
      en: "WhatsApp will not connect",
      ar: "واتساب لا يتصل",
    },
    answers: {
      fa: "• QR را با همان گوشی و همان واتساپی اسکن کن که می‌خواهی فروشگاه روی آن باشد.\n• اگر QR قدیمی شده، صفحه را رفرش کن و QR تازه بگیر.\n• گوشی باید اینترنت داشته و واتساپ باز باشد؛ حالت هواپیما یا باتری‌سیور می‌تواند اتصال را قطع کند.\n• اگر بعد از اسکن وضعیت متصل نشد، یک‌بار جدا کردن و دوباره وصل کردن را امتحان کن.\n• اگر باز هم نشد با پشتیبانی تماس بگیر.",
      en: "• Scan the QR with the exact phone and WhatsApp account the store should use.\n• If the QR expired, refresh the page and get a new one.\n• The phone needs internet and WhatsApp running; airplane mode or battery saver can drop the link.\n• If it stays disconnected after scanning, disconnect and connect again.\n• If it still fails, contact support.",
      ar: "• امسح رمز QR بنفس الهاتف وحساب واتساب المخصص للمتجر.\n• إذا انتهت صلاحية الرمز، حدّث الصفحة واطلب رمزًا جديدًا.\n• يجب أن يكون الهاتف متصلًا بالإنترنت وواتساب يعمل؛ وضع الطيران أو موفر البطارية قد يقطع الربط.\n• إذا بقيت الحالة غير متصلة بعد المسح، افصل ثم أعد الربط.\n• إذا استمرت المشكلة تواصل مع الدعم.",
    },
    keywords: {
      fa: ["واتساپ وصل نمی‌شود", "واتساپ قطع شد", "خطای واتساپ", "QR کار نمی‌کند", "واتساپ آنلاین نیست", "قطع مکرر واتساپ"],
      en: ["whatsapp not connecting", "whatsapp disconnected", "whatsapp error", "qr not working", "whatsapp offline", "keeps disconnecting"],
      ar: ["واتساب لا يتصل", "انقطع واتساب", "خطأ واتساب", "الرمز لا يعمل", "واتساب غير متصل"],
    },
  },
  {
    id: "staff",
    category: "manage",
    titles: {
      fa: "کارکنان و نقش‌ها",
      en: "Staff and roles",
      ar: "الموظفون والأدوار",
    },
    answers: {
      fa: "در صفحه «مدیریت» صاحب فروشگاه می‌تواند کارمند بسازد و نقش بدهد: مدیر شعبه یا فروشنده.\n• فروشنده فقط شعبه خودش را می‌بیند و به تنظیمات شعبه و آمار کل دسترسی ندارد.\n• مدیر شعبه می‌تواند فروش، مرجوعی و مشتریان شعبه خودش را مدیریت کند.\n• برای هر کارمند نام کاربری و رمز جدا بساز.",
      en: "In Manage the store owner can create staff and assign a role: branch manager or sales person.\n• Sales staff see only their own branch and cannot open branch settings or global stats.\n• A branch manager handles sales, refunds and customers for that branch.\n• Create a separate username and password for each staff member.",
      ar: "في صفحة الإدارة يمكن لصاحب المتجر إنشاء موظفين وتحديد الدور: مدير فرع أو مندوب بيع.\n• المندوب يرى فرعه فقط ولا يصل إلى إعدادات الفرع أو الإحصاءات العامة.\n• مدير الفرع يدير البيع والمرتجعات والعملاء في فرعه.\n• أنشئ اسم مستخدم وكلمة مرور منفصلة لكل موظف.",
    },
    keywords: {
      fa: ["کارمند", "نقش", "دسترسی", "فروشنده", "مدیر شعبه", "ساخت کاربر", "مجوز"],
      en: ["staff", "employee", "role", "permission", "sales person", "branch manager", "create user"],
      ar: ["موظف", "دور", "صلاحيات", "مندوب", "مدير فرع", "إنشاء مستخدم"],
    },
  },
  {
    id: "branches",
    category: "manage",
    titles: {
      fa: "شعبه‌ها و لوگو",
      en: "Branches and logo",
      ar: "الفروع والشعار",
    },
    answers: {
      fa: "در «مدیریت» فهرست شعبه‌ها هست؛ شعبه جدید بساز، نام، آدرس و تلفن را وارد کن.\n• در صفحه هر شعبه می‌توانی لوگو آپلود کنی؛ لوگو در فاکتور PDF و سربرگ چاپی استفاده می‌شود.\n• برای دیدن اطلاعات یک شعبه، از سوییچ شعبه در منو شعبه فعال را عوض کن.",
      en: "Manage lists the branches; create a new one with its name, address and phone.\n• On each branch page you can upload a logo; it is used on the PDF invoice and print header.\n• Switch the active branch from the branch selector in the sidebar to work inside another branch.",
      ar: "صفحة الإدارة تعرض الفروع؛ أنشئ فرعًا جديدًا بالاسم والعنوان والهاتف.\n• في صفحة كل فرع يمكنك رفع شعار يُستخدم في الفاتورة PDF والترويسة المطبوعة.\n• بدّل الفرع النشط من محدد الفرع في القائمة الجانبية.",
    },
    keywords: {
      fa: ["شعبه", "شعبه جدید", "لوگو", "انتخاب شعبه", "آدرس شعبه"],
      en: ["branch", "new branch", "logo", "switch branch", "branch address", "multiple branches"],
      ar: ["فرع", "فرع جديد", "شعار", "تبديل الفرع", "عنوان الفرع", "عدة فروع"],
    },
  },
  {
    id: "troubleshooting",
    category: "help",
    titles: {
      fa: "مشکل‌های رایج",
      en: "Common problems",
      ar: "مشكلات شائعة",
    },
    answers: {
      fa: "• آپلود عکس یا اسکن کارت شناسایی: این قابلیت حذف شده و لازم نیست.\n• صفحه سفید یا خطا: صفحه را رفرش کن و از منو دوباره باز کن؛ اگر ادامه داشت با پشتیبانی تماس بگیر.\n• PDF باز نمی‌شود: پاپ‌آپ مرورگر را اجازه بده یا از صفحه فاکتورها دوباره دانلود کن.\n• عدد یا تاریخ اشتباه: بازه تاریخ و شعبه فعال را چک کن.\n• سؤالی که جوابش اینجا نیست را به پشتیبانی بگو تا به راهنما اضافه شود.",
      en: "• Photo upload or ID scanning: that feature has been removed and is not needed.\n• White page or error: refresh and reopen the page from the menu; if it persists contact support.\n• PDF does not open: allow pop-ups for the site, or download again from the Invoices page.\n• Wrong numbers or dates: check the date range and the active branch.\n• If your question is not covered here, tell support so it can be added to this guide.",
      ar: "• رفع الصور أو مسح بطاقة الهوية: أُزيلت هذه الميزة ولا حاجة لها.\n• صفحة بيضاء أو خطأ: حدّث الصفحة وافتحها من القائمة مجددًا، وإن استمر فأبلغ الدعم.\n• الفاتورة PDF لا تفتح: اسمح بالنوافذ المنبثقة أو نزّلها من صفحة الفواتير.\n• أرقام أو تواريخ خاطئة: تحقق من نطاق التاريخ والفرع النشط.\n• إذا لم تجد سؤالك هنا فأبلغ الدعم لإضافته إلى الدليل.",
    },
    keywords: {
      fa: ["مشکل", "خطا", "صفحه سفید", "کار نمی‌کند", "باگ", "کندی", "عکس آپلود", "اسکن کارت"],
      en: ["problem", "error", "white page", "not working", "bug", "slow", "upload image", "id scan"],
      ar: ["مشكلة", "خطأ", "صفحة بيضاء", "لا يعمل", "بطيء", "رفع صورة", "مسح البطاقة"],
    },
  },
];
