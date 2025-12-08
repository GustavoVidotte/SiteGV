import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { nome, empresa, email, telefone, assunto, orcamento, prazo, mensagem } = data

    const logoUrl = "/images/1000861281.jpeg"

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0f;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0f; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(138, 43, 226, 0.2);">
          
          <!-- Header com Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f953c6 100%); padding: 40px 40px 30px; text-align: center;">
              <img src="${logoUrl}" alt="GV Software" width="140" style="margin-bottom: 20px; border-radius: 12px; background: #ffffff; padding: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">Nova Solicitação de Orçamento</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Você recebeu uma nova mensagem pelo site</p>
            </td>
          </tr>
          
          <!-- Informações do Cliente -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                
                <!-- Badge de Urgência se aplicável -->
                ${
                  prazo && prazo.toLowerCase().includes("urgente")
                    ? `
                <tr>
                  <td style="padding-bottom: 25px;">
                    <span style="background: linear-gradient(135deg, #f953c6 0%, #b91d73 100%); color: white; padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">⚡ Projeto Urgente</span>
                  </td>
                </tr>
                `
                    : ""
                }
                
                <!-- Card de Informações do Cliente -->
                <tr>
                  <td style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px; margin-bottom: 20px;">
                    <h2 style="color: #a78bfa; margin: 0 0 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">👤 Informações do Cliente</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #888; font-size: 13px; display: block; margin-bottom: 4px;">Nome</span>
                          <span style="color: #ffffff; font-size: 16px; font-weight: 500;">${nome}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #888; font-size: 13px; display: block; margin-bottom: 4px;">Empresa</span>
                          <span style="color: #ffffff; font-size: 16px; font-weight: 500;">${empresa || "Não informado"}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                          <span style="color: #888; font-size: 13px; display: block; margin-bottom: 4px;">E-mail</span>
                          <a href="mailto:${email}" style="color: #60a5fa; font-size: 16px; font-weight: 500; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <span style="color: #888; font-size: 13px; display: block; margin-bottom: 4px;">Telefone</span>
                          <a href="tel:${telefone}" style="color: #60a5fa; font-size: 16px; font-weight: 500; text-decoration: none;">${telefone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr><td style="height: 20px;"></td></tr>
                
                <!-- Card de Detalhes do Projeto -->
                <tr>
                  <td style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px;">
                    <h2 style="color: #a78bfa; margin: 0 0 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">📋 Detalhes do Projeto</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="33%" style="padding: 15px; background: rgba(139, 92, 246, 0.1); border-radius: 10px; text-align: center; vertical-align: top;">
                          <span style="color: #888; font-size: 12px; display: block; margin-bottom: 6px; text-transform: uppercase;">Assunto</span>
                          <span style="color: #c4b5fd; font-size: 14px; font-weight: 600;">${assunto}</span>
                        </td>
                        <td width="5%"></td>
                        <td width="33%" style="padding: 15px; background: rgba(34, 197, 94, 0.1); border-radius: 10px; text-align: center; vertical-align: top;">
                          <span style="color: #888; font-size: 12px; display: block; margin-bottom: 6px; text-transform: uppercase;">Orçamento</span>
                          <span style="color: #86efac; font-size: 14px; font-weight: 600;">${orcamento || "A definir"}</span>
                        </td>
                        <td width="5%"></td>
                        <td width="33%" style="padding: 15px; background: rgba(251, 191, 36, 0.1); border-radius: 10px; text-align: center; vertical-align: top;">
                          <span style="color: #888; font-size: 12px; display: block; margin-bottom: 6px; text-transform: uppercase;">Prazo</span>
                          <span style="color: #fde047; font-size: 14px; font-weight: 600;">${prazo || "Flexível"}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr><td style="height: 20px;"></td></tr>
                
                <!-- Card da Mensagem -->
                <tr>
                  <td style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 25px;">
                    <h2 style="color: #a78bfa; margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">💬 Mensagem</h2>
                    <p style="color: #e2e8f0; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${mensagem}</p>
                  </td>
                </tr>
                
                <tr><td style="height: 30px;"></td></tr>
                
                <!-- Botão de Responder -->
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: ${assunto} - GV Software" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);">
                      ✉️ Responder Cliente
                    </a>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: rgba(0,0,0,0.3); padding: 25px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="color: #666; margin: 0; font-size: 13px;">
                Este email foi enviado automaticamente pelo formulário do site<br>
                <strong style="color: #a78bfa;">GV Software</strong> • Inovação & Tecnologia
              </p>
              <p style="color: #444; margin: 15px 0 0; font-size: 11px;">
                ${new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    // Versão texto para clientes de email que não suportam HTML
    const textContent = `
Nova mensagem de contato - GV Software

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INFORMAÇÕES DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${nome}
Empresa: ${empresa || "Não informado"}
E-mail: ${email}
Telefone: ${telefone}

DETALHES DO PROJETO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Assunto: ${assunto}
Orçamento: ${orcamento || "Não informado"}
Prazo: ${prazo || "Não informado"}

MENSAGEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${mensagem}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Enviado pelo formulário do site GV Software
    `.trim()

    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "GV Software <onboarding@resend.dev>",
          to: "contato.gvsoftware@gmail.com",
          subject: `🚀 [GV Software] ${assunto} - ${nome}`,
          html: htmlContent,
          text: textContent,
          reply_to: email,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar email")
      }
    } else {
      console.log("=== NOVO CONTATO ===")
      console.log(textContent)
      console.log("====================")
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" })
  } catch (error) {
    console.error("Erro ao processar contato:", error)
    return NextResponse.json({ success: false, message: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
