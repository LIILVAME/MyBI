// Supabase Edge Function - Vérification des alertes
// Exécution quotidienne via cron job
// Documentation : https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialise Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1️⃣ Récupère les paiements en retard (status != 'paid' et date < maintenant - 5 jours)
    const fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5)
    const fiveDaysAgoStr = fiveDaysAgo.toISOString().split('T')[0]

    const { data: latePayments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        *,
        properties!inner(id, name, user_id),
        tenants(id, name)
      `)
      .neq('status', 'paid')
      .lt('due_date', fiveDaysAgoStr)

    if (paymentsError) {
      throw new Error(`Error fetching late payments: ${paymentsError.message}`)
    }

    // 2️⃣ Pour chaque paiement en retard, envoie une alerte
    const alerts = []
    
    if (latePayments && latePayments.length > 0) {
      // TODO v0.3.0+ : Envoyer des emails via Supabase Email ou SendGrid
      // Pour l'instant, on log juste les alertes
      
      for (const payment of latePayments) {
        const daysLate = Math.floor(
          (new Date().getTime() - new Date(payment.due_date).getTime()) / (1000 * 60 * 60 * 24)
        )

        alerts.push({
          user_id: payment.properties.user_id,
          payment_id: payment.id,
          property_name: payment.properties.name,
          amount: payment.amount,
          days_late: daysLate,
          type: 'late_payment',
          message: `Paiement en retard : ${payment.properties.name} - ${payment.amount}€ (${daysLate} jours)`
        })

        // TODO : Envoyer email via Supabase Email
        // await supabase.functions.invoke('sendEmail', {
        //   body: {
        //     to: userEmail,
        //     subject: 'Alerte : Paiement en retard',
        //     html: `...`
        //   }
        // })
      }
    }

    // 3️⃣ Vérifie les fins de bail approchantes (dans les 30 prochains jours)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    const thirtyDaysStr = thirtyDaysFromNow.toISOString().split('T')[0]

    const { data: upcomingLeaseEnds, error: leaseError } = await supabase
      .from('tenants')
      .select(`
        *,
        properties!inner(id, name, user_id)
      `)
      .not('exit_date', 'is', null)
      .lte('exit_date', thirtyDaysStr)
      .gte('exit_date', new Date().toISOString().split('T')[0])

    if (!leaseError && upcomingLeaseEnds) {
      for (const tenant of upcomingLeaseEnds) {
        const exitDate = new Date(tenant.exit_date)
        const daysUntilExit = Math.floor(
          (exitDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )

        alerts.push({
          user_id: tenant.properties.user_id,
          tenant_id: tenant.id,
          property_name: tenant.properties.name,
          tenant_name: tenant.name,
          exit_date: tenant.exit_date,
          days_until_exit: daysUntilExit,
          type: 'upcoming_lease_end',
          message: `Fin de bail approchante : ${tenant.name} - ${tenant.properties.name} (dans ${daysUntilExit} jours)`
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alerts_count: alerts.length,
        alerts: alerts
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

