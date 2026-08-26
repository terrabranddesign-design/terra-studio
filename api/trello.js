export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      company,
      contact,
      email,
      scope,
      description
    } = req.body;

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
      key: process.env.TRELLO_API_KEY,
      token: process.env.TRELLO_TOKEN
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

      return res.status(500).json({
        error: 'Trello request failed'
      });
    }

    return res.status(200).json({
      success: true,
      cardId: trelloData.id
    });

  } catch (error) {
    console.error('Server error:', error);

    return res.status(500).json({
      error: 'Server error'
    });
  }
}
