export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  try {
    if (!env.TRELLO_API_KEY || !env.TRELLO_TOKEN) {
      return Response.json(
        { error: 'Missing Trello secrets' },
        { status: 500 }
      );
    }

    const {
      name = '',
      company = '',
      contact = '',
      email = '',
      scope = '',
      description = ''
    } = await request.json();

    const listId = '6a8e2931c0e39dba75074e8a';

    const cardName = name
      ? `Новая заявка — ${name}`
      : 'Новая заявка с сайта';

    const cardDescription = [
      `Имя: ${name || '—'}`,
      `Компания / бренд: ${company || '—'}`,
      `Телефон / Telegram: ${contact || '—'}`,
      `Email: ${email || '—'}`,
      `Услуги: ${scope || '—'}`,
      '',
      'Задача:',
      description || '—',
      '',
      'Источник: https://terra-brand.ru'
    ].join('\n');

    const params = new URLSearchParams({
      idList: listId,
      name: cardName,
      desc: cardDescription,
      key: env.TRELLO_API_KEY,
      token: env.TRELLO_TOKEN
    });

    const trelloResponse = await fetch(
      `https://api.trello.com/1/cards?${params.toString()}`,
      {
        method: 'POST'
      }
    );

    const responseText = await trelloResponse.text();

    let trelloData = {};

    try {
      trelloData = responseText
        ? JSON.parse(responseText)
        : {};
    } catch {
      trelloData = {
        raw: responseText
      };
    }

    if (!trelloResponse.ok) {
      return Response.json(
        {
          error: 'Trello request failed',
          trelloStatus: trelloResponse.status,
          details: trelloData
        },
        {
          status: 502
        }
      );
    }

    return Response.json(
      {
        success: true,
        cardId: trelloData.id
      },
      {
        status: 200
      }
    );

  } catch (error) {
    return Response.json(
      {
        error: 'Server error',
        details: error.message
      },
      {
        status: 500
      }
    );
  }
}
