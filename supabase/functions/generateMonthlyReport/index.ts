// Supabase Edge Function - Génération de rapport mensuel
// Peut être appelée manuellement ou via cron job
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
    const { month, user_id } = await req.json()

    if (!month || !user_id) {
      throw new Error('Missing required parameters: month and user_id')
    }

    // Initialise Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Parse le mois (format "YYYY-MM")
    const [year, monthNum] = month.split('-')
    const startDate = new Date(year, parseInt(monthNum) - 1, 1)
    const endDate = new Date(year, parseInt(monthNum), 0, 23, 59, 59)

    // Récupère les données du mois
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        *,
        properties (id, name, city),
        tenants (id, name)
      `)
      .eq('user_id', user_id)
      .gte('due_date', startDate.toISOString().split('T')[0])
      .lte('due_date', endDate.toISOString().split('T')[0])

    if (paymentsError) throw paymentsError

    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user_id)

    if (propertiesError) throw propertiesError

    // Calcule les statistiques
    const paidPayments = payments?.filter(p => p.status === 'paid') || []
    const totalRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
    const occupiedProperties = properties?.filter(p => p.status === 'occupied').length || 0
    const occupancyRate = properties?.length > 0 
      ? Math.round((occupiedProperties / properties.length) * 100) 
      : 0

    const report = {
      month,
      user_id,
      generated_at: new Date().toISOString(),
      statistics: {
        total_revenue: totalRevenue,
        occupancy_rate: occupancyRate,
        total_payments: payments?.length || 0,
        paid_payments: paidPayments.length,
        late_payments: payments?.filter(p => p.status === 'late').length || 0
      },
      payments: payments || [],
      properties: properties || []
    }

    // TODO v0.3.0+ : Générer le PDF côté serveur et l'envoyer par email
    // Pour l'instant, on retourne juste les données JSON

    return new Response(
      JSON.stringify({
        success: true,
        report: report
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

