import { Card, Badge } from '../components/ui'
import { GOLDEN_TABLE } from '../data/accountTypes'

export function Reference() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">📋 المرجع السريع</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">أهم القواعد في مكان واحد</p>
      </div>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
          <span className="text-xl">🏆</span> الجدول الذهبي
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <th className="px-3 py-2.5 text-right font-extrabold">نوع الحساب</th>
                <th className="px-3 py-2.5 text-center font-extrabold">طبيعته</th>
                <th className="px-3 py-2.5 text-center font-extrabold">عند الزيادة</th>
                <th className="px-3 py-2.5 text-center font-extrabold">عند النقص</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-100 dark:border-slate-700/60">
                <td className="px-3 py-2.5 font-bold text-blue-700 dark:text-blue-400">الأصل (Asset)</td>
                <td className="px-3 py-2.5 text-center"><Badge color="blue">مدين</Badge></td>
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400">مدين</td>
                <td className="px-3 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700/60">
                <td className="px-3 py-2.5 font-bold text-rose-700 dark:text-rose-400">المصروف (Expense)</td>
                <td className="px-3 py-2.5 text-center"><Badge color="blue">مدين</Badge></td>
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400">مدين</td>
                <td className="px-3 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700/60">
                <td className="px-3 py-2.5 font-bold text-emerald-700 dark:text-emerald-400">الخصم (Liability)</td>
                <td className="px-3 py-2.5 text-center"><Badge color="green">دائن</Badge></td>
                <td className="px-3 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</td>
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400">مدين</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700/60">
                <td className="px-3 py-2.5 font-bold text-purple-700 dark:text-purple-400">حقوق الملكية (Equity)</td>
                <td className="px-3 py-2.5 text-center"><Badge color="green">دائن</Badge></td>
                <td className="px-3 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</td>
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400">مدين</td>
              </tr>
              <tr className="border-t border-slate-100 dark:border-slate-700/60">
                <td className="px-3 py-2.5 font-bold text-amber-700 dark:text-amber-400">الإيراد (Revenue)</td>
                <td className="px-3 py-2.5 text-center"><Badge color="green">دائن</Badge></td>
                <td className="px-3 py-2.5 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</td>
                <td className="px-3 py-2.5 text-center font-bold text-blue-700 dark:text-blue-400">مدين</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">✍️ معاني الرموز</h2>
          <div className="space-y-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              من حـ/ = مدين (Debit)
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              إلى حـ/ = دائن (Credit)
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">🔑 القاعدة الأساسية</h2>
          <div className="space-y-2">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              💙 {GOLDEN_TABLE.debitGroup}
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              💚 {GOLDEN_TABLE.creditGroup}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">🧠 خطوات التفكير في أي عملية</h2>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {[
            ['📝', 'اسأل: مين الحسابات المتأثرة؟'],
            ['🏷️', 'حدد نوع كل حساب'],
            ['📈', 'هل زاد أم نقص؟'],
            ['↔️', 'مدين أم دائن؟'],
            ['📒', 'اكتب القيد'],
            ['❓', 'افهم إزاي وليه'],
          ].map(([icon, text]) => (
            <div key={text} className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className="ml-1">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}