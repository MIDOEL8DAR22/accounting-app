import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Badge } from '../components/ui'
import { EntryTable } from '../components/DecisionFlow'
import { ACCOUNT_TYPES, GOLDEN_TABLE } from '../data/accountTypes'
import { recordSummaryView } from '../lib/progress'
import { IconBookMark, IconPen, IconBrain, IconAlert, IconCheckCircle, IconTarget, IconKey, IconSearch, IconLayers } from '../components/icons'

const SIDE_LABEL: Record<string, string> = { debit: 'مدين', credit: 'دائن' }

export function SummaryPage() {
  useEffect(() => { recordSummaryView() }, [])

  return (
    <div className="space-y-8">

      <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg sm:p-8 sm:text-center">
        <div className="flex justify-center sm:justify-center mb-3 text-4xl"><IconBookMark size={48} /></div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">تلخيص المحاسبة من الصفر</h1>
        <p className="mt-2 text-sm opacity-90 sm:text-base">كل حاجة محتاجها في مكان واحد — الأنواع، القواعد، القيد، وأسرار الحل.</p>
      </section>

      {/* ──────────────── حسابات الخمسة ──────────────── */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
          <IconLayers size={20} className="text-blue-600" /> أنواع الحسابات الخمسة
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <th className="px-3 py-2 text-right font-extrabold">النوع</th>
                <th className="px-3 py-2 text-right font-extrabold">ببساطة أيه؟</th>
                <th className="px-3 py-2 text-right font-extrabold">أمثلة</th>
                <th className="px-3 py-2 text-right font-extrabold">بيزيد في</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNT_TYPES.map((acc) => (
                <tr key={acc.type} className="border-t border-slate-100 dark:border-slate-700/60">
                  <td className="px-3 py-3 font-extrabold text-slate-800 dark:text-slate-100">{acc.nameAr}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{acc.definition}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{acc.examples.slice(0, 4).join('، ')}</td>
                  <td className="px-3 py-3">
                    <Badge color={acc.normalSide === 'debit' ? 'red' : 'green'}>{SIDE_LABEL[acc.normalSide]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ──────────────── إيراد ≠ ربح ──────────────── */}
      <Card className="space-y-4 border-amber-200 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10">
        <div className="flex items-center gap-2 text-base font-extrabold text-amber-800 dark:text-amber-200">
          <IconAlert size={20} /> معلومة غلط بتكرر: الإيراد ≠ الربح
        </div>
        <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-200">
          <strong>الإيراد = المبلغ بالكامل اللي بعتت به.</strong> الربح = الإيراد ناقص تكلفة البضاعة والنقل والتصنيع. أغلب الناس بتخلط بينهم.
        </p>
        <div className="overflow-x-auto rounded-xl border border-amber-200 bg-white dark:border-amber-500/30 dark:bg-slate-800/60">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-amber-200 dark:border-amber-500/30 bg-amber-100/50 dark:bg-amber-500/10">
                <th className="px-3 py-2 text-right font-extrabold text-amber-800 dark:text-amber-200">الحساب</th>
                <th className="px-3 py-2 text-right font-extrabold text-amber-800 dark:text-amber-200">المبلغ</th>
              </tr>
            </thead>
            <tbody className="text-amber-900 dark:text-amber-100">
              <tr className="border-t border-amber-200/60 dark:border-amber-500/20"><td className="px-3 py-2 font-bold">اشترينا بضاعة</td><td className="px-3 py-2">5,000</td></tr>
              <tr className="border-t border-amber-200/60 dark:border-amber-500/20"><td className="px-3 py-2 font-bold">نقل</td><td className="px-3 py-2">200</td></tr>
              <tr className="border-t border-amber-200/60 dark:border-amber-500/20 bg-amber-100/30 dark:bg-amber-500/10"><td className="px-3 py-2 font-extrabold">الإيراد (بيع)</td><td className="px-3 py-2 font-extrabold">6,000</td></tr>
              <tr className="border-t border-amber-200/60 dark:border-amber-500/20"><td className="px-3 py-2 font-bold">التكلفة</td><td className="px-3 py-2">5,200</td></tr>
              <tr className="border-t border-amber-200/60 dark:border-amber-500/20 bg-amber-100/30 dark:bg-amber-500/10"><td className="px-3 py-2 font-extrabold">الربح</td><td className="px-3 py-2 font-extrabold">800</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm font-bold text-amber-700 dark:text-amber-300">الإيراد هو 6,000 — مش 800. الربح 800 بس.</p>
      </Card>

      {/* ──────────────── حفظهم ──────────────── */}
      <div>
        <h2 className="mb-4 text-lg font-extrabold text-slate-800 dark:text-slate-100">احفظهم بالطريقة دي</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: 'الأصول', text: 'ليا — كل حاجة ملكك', color: 'blue' },
            { label: 'الخصوم', text: 'عليا — ديون عليك للموردين والبنوك', color: 'green' },
            { label: 'حقوق الملكية', text: 'حق أصحاب الشركة — رأس المال والأرباح', color: 'purple' },
            { label: 'المصروفات', text: 'بدفع عشان أشتغل وأكسب — إيجار ومرتبات وكهرباء', color: 'red' },
            { label: 'الإيرادات', text: 'دخل النشاط الأساسي — بيع بضاعة أو تقديم خدمة', color: 'amber' },
          ].map((m) => (
            <Card key={m.label} className="space-y-1">
              <Badge color={m.color}>{m.label}</Badge>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{m.text}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* ──────────────── القاعدة الذهبية ──────────────── */}
      <Card className="space-y-4 border-blue-200 dark:border-blue-500/40 bg-blue-50/80 dark:bg-blue-500/10">
        <div className="flex items-center gap-2 text-base font-extrabold text-blue-800 dark:text-blue-200">
          <IconKey size={20} /> القاعدة الذهبية للقيد
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200 dark:border-blue-500/30">
                <th className="px-3 py-2 text-right font-extrabold text-blue-800 dark:text-blue-200">الحسابات اللي طبيعتها مدين</th>
                <th className="px-3 py-2 text-right font-extrabold text-blue-800 dark:text-blue-200">الحسابات اللي طبيعتها دائن</th>
              </tr>
            </thead>
            <tbody className="text-blue-900 dark:text-blue-100">
              <tr className="border-t border-blue-200/60 dark:border-blue-500/20">
                <td className="px-3 py-3 font-bold">{GOLDEN_TABLE.debitGroup}</td>
                <td className="px-3 py-3 font-bold">{GOLDEN_TABLE.creditGroup}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl bg-white p-4 font-extrabold text-blue-900 shadow-sm dark:bg-slate-800 dark:text-blue-100">
          الأصول والمصروفات مدين، والخصوم وحقوق الملكية والإيرادات دائن.
        </div>
        <div className="flex items-start gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
          <IconAlert size={16} className="mt-0.5 shrink-0" />
          <span>الجملة دي توصف <strong>الطبيعة الأصلية</strong> للحسابات. بس مش معناها إنها دايمًا بتمشي بالطريقة دي — لو الحساب نقص، بتتسجل في الاتجاه المعاكس.</span>
        </div>
      </Card>

      {/* ──────────────── أسرار القيد ──────────────── */}
      <Card className="space-y-4 border-emerald-200 dark:border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-500/10">
        <div className="flex items-center gap-2 text-base font-extrabold text-emerald-800 dark:text-emerald-200">
          <IconBrain size={20} /> أسهل طريقة لحل أي عملية
        </div>
        <ol className="space-y-0">
          {[
            { label: 'إيه اللي حصل؟', detail: 'اقرأ الجملة واستخرج كل الحسابات اللي اتمسكت فيها (ناس، بضاعة، خدمة).' },
            { label: 'كل حساب نوعه إيه؟', detail: 'حدد: أصل، خصم، حقوق ملكية، إيراد، أو مصروف. لو مش متأكد، راجع قواعد الأنواع.' },
            { label: 'الحساب زاد ولا نقص؟', detail: 'اعرف إذا كان الحساب زاد ولا نقص، وبعدين حدد: لو زاد وطبيعته مدين → مدين. لو نقص → الاتجاه المعاكس.' },
          ].map((step, i) => (
            <li key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
              {i < 2 && <span className="absolute top-6 right-[11px] h-[calc(100%-18px)] w-0.5 bg-emerald-200 dark:bg-emerald-500/40" />}
              <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">{i + 1}</span>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">{step.label}</div>
                <div className="mt-0.5 text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">{step.detail}</div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* ──────────────── مثال كامل ──────────────── */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
          <IconPen size={20} className="text-blue-600" /> مثال: اشترينا بضاعة نقداً بـ 10,000
        </div>
        <ol className="space-y-3">
          <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="shrink-0 font-extrabold text-blue-600">1.</span>
            <span>العملية: اشترينا بضاعة ودفعنا فلوس نقداً.</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="shrink-0 font-extrabold text-blue-600">2.</span>
            <span>الحسابات: <strong>المشتريات</strong> (مصروف) و<strong>النقدية</strong> (أصل).</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
            <span className="shrink-0 font-extrabold text-blue-600">3.</span>
            <span>المشتريات مصروف وزادت ← مدين. النقدية أصل ونقصت ← دائن.</span>
          </li>
        </ol>
        <EntryTable debit="المشتريات  10,000" credit="النقدية  10,000" />
      </Card>

      {/* ──────────────── المشكلة الحقيقية ──────────────── */}
      <Card className="space-y-3 border-rose-200 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10">
        <div className="flex items-center gap-2 text-base font-extrabold text-rose-800 dark:text-rose-200">
          <IconAlert size={20} /> مشكلتك الحقيقية فين؟
        </div>
        <p className="text-sm leading-relaxed text-rose-800 dark:text-rose-200">
          أصعب حاجة موش القيد نفسه — أصعب حاجة إنك <strong>تستخرج الحسابات من الجملة</strong>.
          القيد بيجي بعدها بسهولة لو عندك الحسابات والأنواع صح.
        </p>
        <p className="text-sm font-bold text-rose-700 dark:text-rose-300">نفس طريقة التدريب: تدرب على استخراج الحسابات قبل ما تحفظ القيود.</p>
      </Card>

      {/* ──────────────── الشجرة الذهنية ──────────────── */}
      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
          <IconTarget size={20} className="text-blue-600" /> الشجرة الذهنية
        </div>
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          {['العملية', 'استخرج الحسابات', 'حدّد النوع', 'حدّد الطبيعة', 'شوف زاد أو نقص', 'اعمل القيد'].map((step, i, arr) => (
            <li key={i} className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full bg-blue-100 px-2.5 text-xs font-extrabold text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">{step}</span>
              {i < arr.length - 1 && <span className="text-slate-400 dark:text-slate-500">←</span>}
            </li>
          ))}
        </ol>
      </Card>

      {/* ──────────────── تدرب ──────────────── */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
          <IconSearch size={20} className="text-blue-600" /> تدرب على الجمل دي
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">جرّب تحلها بنفسك: اقرأ الجملة، استخرج الحسابات، حدد النوع والاتجاه، وبعدين ادخل على <strong>حل المعاملات</strong> أو <strong>التمارين</strong> وطبّق.</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            'اشترينا بضاعة نقداً',
            'بِعنا بضاعة بـ 8,000 آجل',
            'دفعنا إيجار المكتب',
            'قبضنا فلوس من عميل',
            'سددنا لمورد',
            'أخذنا قرض من البنك',
            'دفعنا مرتبات الموظفين',
            'صاحب الشركة أودع رأس مال',
          ].map((s) => (
            <li key={s} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">{s}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link to="/solver" className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">
            <IconSearch size={15} /> حل المعاملات
          </Link>
          <Link to="/exercises" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
            <IconCheckCircle size={15} /> التمارين
          </Link>
        </div>
      </Card>

    </div>
  )
}