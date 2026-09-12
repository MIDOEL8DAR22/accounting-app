import { Card, Badge } from '../components/ui'
import { GOLDEN_TABLE } from '../data/accountTypes'
import {
  IconClipboard,
  IconAward,
  IconPen,
  IconKey,
  IconBrain,
  IconSearch,
  IconTag,
  IconChartUp,
  IconScale,
  IconNotebook,
  IconQuestion,
} from '../components/icons'

export function Reference() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconClipboard size={18} /></span>
          المرجع السريع
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">أهم القواعد في مكان واحد</p>
      </div>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
          <IconAward size={18} className="text-amber-500" /> الجدول الذهبي
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
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
            <IconPen size={16} className="text-slate-400" /> معاني الرموز
          </h2>
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
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
            <IconKey size={16} className="text-amber-500" /> القاعدة الأساسية
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
              <span>{GOLDEN_TABLE.debitGroup}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{GOLDEN_TABLE.creditGroup}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
          <IconBrain size={18} className="text-purple-500" /> خطوات التفكير في أي عملية
        </h2>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {[
            [<IconSearch key="1" size={15} className="text-blue-500" />, 'اسأل: مين الحسابات المتأثرة؟'],
            [<IconTag key="2" size={15} className="text-blue-500" />, 'حدد نوع كل حساب'],
            [<IconChartUp key="3" size={15} className="text-blue-500" />, 'هل زاد أم نقص؟'],
            [<IconScale key="4" size={15} className="text-blue-500" />, 'مدين أم دائن؟'],
            [<IconNotebook key="5" size={15} className="text-blue-500" />, 'اكتب القيد'],
            [<IconQuestion key="6" size={15} className="text-blue-500" />, 'افهم إزاي وليه'],
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-200/70 text-[11px] font-extrabold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                {i + 1}
              </span>
              {icon}
              <span>{text as string}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}