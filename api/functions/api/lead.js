export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const {
      name,
      company,
      contact,
      email,
      scope,
      description
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
      `Источник: https://terra-brand.ru`
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

    const trelloData = await trelloResponse.json();

    if (!trelloResponse.ok) {
      console.error('Trello error:', trelloData);

      return Response.json(
        { error: 'Trello request failed' },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        cardId: trelloData.id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Server error:', error);

    return Response.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}

export function onRequest(context) {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
