import { useEffect, useState } from 'react';
import { api, clearTokens, getSavedUser, saveTokens } from './api/client.js';

export default function App() {
  const [user, setUser] = useState(getSavedUser());
  const [message, setMessage] = useState('');

  function handleLogin(tokens) {
    saveTokens(tokens);
    setUser(tokens.user);
    setMessage('Вы вошли в систему');
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch (error) {
      console.warn(error.message);
    }

    clearTokens();
    setUser(null);
    setMessage('Вы вышли из аккаунта');
  }

  return (
      <div className="app">
        <header className="topbar">
          <h1>Literacy Platform</h1>
          {user && <button onClick={handleLogout}>Выйти</button>}
        </header>

        {message && <div className="message">{message}</div>}

        {!user ? (
            <AuthPage onLogin={handleLogin} setMessage={setMessage} />
        ) : (
            <Dashboard user={user} setMessage={setMessage} />
        )}
      </div>
  );
}

function AuthPage({ onLogin, setMessage }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const tokens =
          mode === 'login'
              ? await api.login(email, password)
              : await api.register(name, email, password);

      onLogin(tokens);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className="auth-layout">
        <section className="card auth-card">
          <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>

          <div className="tabs">
            <button
                type="button"
                className={mode === 'login' ? 'active' : ''}
                onClick={() => setMode('login')}
            >
              Login
            </button>

            <button
                type="button"
                className={mode === 'register' ? 'active' : ''}
                onClick={() => setMode('register')}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
                <label>
                  Name
                  <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Введите имя"
                  />
                </label>
            )}

            <label>
              Email
              <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Введите email"
              />
            </label>

            <label>
              Password
              <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Введите пароль"
              />
            </label>

            <button className="primary" disabled={loading}>
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>
        </section>
      </main>
  );
}

function Dashboard({ user, setMessage }) {
  const isAdmin = user.role === 'ADMIN';

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [editChild, setEditChild] = useState(null);

  const [units, setUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');

  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [exercises, setExercises] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [lessonResult, setLessonResult] = useState(null);

  const [progress, setProgress] = useState([]);
  const [badges, setBadges] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [lessonForm, setLessonForm] = useState({
    unitId: '',
    title: '',
    description: '',
    lessonType: 'PHONICS',
    difficulty: 'EASY',
    baseXp: 50,
    sortOrder: 1,
    published: true
  });

  const [exerciseForm, setExerciseForm] = useState({
    exerciseType: 'PHONICS',
    prompt: '',
    correctAnswer: '',
    displayOrder: 1
  });

  const selectedChild = children.find((child) => String(child.id) === String(selectedChildId));

  async function loadMainData() {
    try {
      const [childrenResponse, unitsResponse, notificationsResponse] = await Promise.all([
        api.getChildren(),
        api.getUnits(),
        api.getNotifications().catch(() => ({ content: [] }))
      ]);

      const loadedChildren = childrenResponse.content || [];
      const loadedUnits = unitsResponse || [];

      setChildren(loadedChildren);
      setUnits(loadedUnits);
      setNotifications(notificationsResponse.content || []);

      if (loadedChildren.length > 0 && !selectedChildId) {
        setSelectedChildId(String(loadedChildren[0].id));
      }

      if (loadedUnits.length > 0) {
        setSelectedUnitId((current) => current || String(loadedUnits[0].id));
        setLessonForm((current) => ({
          ...current,
          unitId: current.unitId || String(loadedUnits[0].id)
        }));
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadChildDetails(childId) {
    if (!childId) {
      setProgress([]);
      setBadges([]);
      return;
    }

    try {
      const [progressResponse, badgesResponse] = await Promise.all([
        api.getProgress(childId),
        api.getBadges(childId)
      ]);

      setProgress(progressResponse.content || []);
      setBadges(badgesResponse.content || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadMainData();
  }, []);

  useEffect(() => {
    loadChildDetails(selectedChildId);
  }, [selectedChildId]);

  useEffect(() => {
    if (selectedChild) {
      setEditChild({
        name: selectedChild.name,
        age: selectedChild.age,
        avatar: selectedChild.avatar,
        startingLevel: selectedChild.startingLevel
      });
    } else {
      setEditChild(null);
    }
  }, [selectedChildId, children]);

  async function handleCreateChild(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const child = {
      name: formData.get('name'),
      age: Number(formData.get('age')),
      avatar: formData.get('avatar'),
      startingLevel: Number(formData.get('startingLevel'))
    };

    try {
      const createdChild = await api.createChild(child);

      setChildren((current) => [...current, createdChild]);
      setSelectedChildId(String(createdChild.id));
      setProgress([]);
      setBadges([]);

      form.reset();
      setMessage('Ребёнок добавлен');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateChild(event) {
    event.preventDefault();

    if (!selectedChild || !editChild) {
      setMessage('Сначала выбери ребёнка');
      return;
    }

    try {
      const updatedChild = await api.updateChild(selectedChild.id, {
        name: editChild.name,
        age: Number(editChild.age),
        avatar: editChild.avatar,
        startingLevel: Number(editChild.startingLevel)
      });

      setChildren((current) =>
          current.map((child) => (child.id === updatedChild.id ? updatedChild : child))
      );

      setMessage('Данные ребёнка обновлены');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteChild() {
    if (!selectedChild) {
      setMessage('Сначала выбери ребёнка');
      return;
    }

    const confirmed = window.confirm(`Удалить ребёнка ${selectedChild.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteChild(selectedChild.id);

      const remainingChildren = children.filter((child) => child.id !== selectedChild.id);
      setChildren(remainingChildren);
      setSelectedChildId(remainingChildren[0] ? String(remainingChildren[0].id) : '');
      setProgress([]);
      setBadges([]);

      setMessage('Ребёнок удалён');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLoadLessons(unitId) {
    try {
      setSelectedUnitId(String(unitId));

      const response = await api.getLessons(unitId);

      setLessons(response.content || []);
      setSelectedLesson(null);
      setExercises([]);
      setAnswers({});
      setSubmittedAnswers({});
      setLessonResult(null);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLoadExercises(lesson) {
    try {
      const response = await api.getExercises(lesson.id);

      setSelectedLesson(lesson);
      setExercises(response.content || []);
      setAnswers({});
      setSubmittedAnswers({});
      setLessonResult(null);
      setMessage(`Открыт урок: ${lesson.title}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleSubmitAnswer(exerciseId) {
    if (!selectedChildId) {
      setMessage('Сначала выбери ребёнка');
      return;
    }

    const answer = answers[exerciseId];

    if (!answer || !answer.trim()) {
      setMessage('Сначала введи ответ');
      return;
    }

    try {
      const result = await api.submitExercise(
          exerciseId,
          Number(selectedChildId),
          answer,
          30
      );

      setSubmittedAnswers((current) => ({
        ...current,
        [exerciseId]: {
          correct: result.correct,
          submissionId: result.submissionId
        }
      }));

      const exerciseNumber = exercises.findIndex((exercise) => exercise.id === exerciseId) + 1;

      setMessage(
          result.correct
              ? `Exercise ${exerciseNumber}: ответ отправлен, правильно`
              : `Exercise ${exerciseNumber}: ответ отправлен, неправильно`
      );
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCompleteLesson() {
    if (!selectedLesson || !selectedChildId) {
      setMessage('Сначала выбери ребёнка и урок');
      return;
    }

    const submittedCount = exercises.filter(
        (exercise) => submittedAnswers[exercise.id] !== undefined
    ).length;

    if (submittedCount < exercises.length) {
      setMessage(`Сначала отправь ответы на все упражнения: ${submittedCount}/${exercises.length}`);
      return;
    }

    try {
      const result = await api.completeLesson(
          selectedLesson.id,
          Number(selectedChildId),
          90
      );

      setLessonResult({
        success: true,
        xpEarned: result.xpEarned,
        stars: result.stars,
        accuracy: result.accuracy,
        newBadges: result.newBadges || [],
        message: result.message
      });

      setMessage('Урок завершён');

      await loadChildDetails(selectedChildId);
      await loadMainData();
    } catch (error) {
      setLessonResult({
        success: false,
        message: error.message
      });

      setMessage(error.message);
    }
  }

  async function handleCreateLesson(event) {
    event.preventDefault();

    if (!lessonForm.unitId) {
      setMessage('Сначала выбери unit');
      return;
    }

    try {
      const createdLesson = await api.createLesson({
        unitId: Number(lessonForm.unitId),
        title: lessonForm.title,
        description: lessonForm.description,
        lessonType: lessonForm.lessonType,
        difficulty: lessonForm.difficulty,
        baseXp: Number(lessonForm.baseXp),
        sortOrder: Number(lessonForm.sortOrder),
        published: Boolean(lessonForm.published)
      });

      if (String(createdLesson.unitId) === String(selectedUnitId)) {
        setLessons((current) => [...current, createdLesson]);
      }

      setLessonForm((current) => ({
        ...current,
        title: '',
        description: '',
        baseXp: 50,
        sortOrder: Number(current.sortOrder) + 1,
        published: true
      }));

      setMessage('Lesson создан');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateExercise(event) {
    event.preventDefault();

    if (!selectedLesson) {
      setMessage('Сначала выбери lesson');
      return;
    }

    try {
      const createdExercise = await api.createExercise(selectedLesson.id, {
        exerciseType: exerciseForm.exerciseType,
        prompt: exerciseForm.prompt,
        correctAnswer: exerciseForm.correctAnswer,
        displayOrder: Number(exerciseForm.displayOrder)
      });

      setExercises((current) => [...current, createdExercise]);

      setExerciseForm((current) => ({
        ...current,
        prompt: '',
        correctAnswer: '',
        displayOrder: Number(current.displayOrder) + 1
      }));

      setMessage('Exercise создан');
    } catch (error) {
      setMessage(error.message);
    }
  }

  const submittedCount = exercises.filter(
      (exercise) => submittedAnswers[exercise.id] !== undefined
  ).length;

  return (
      <main className="dashboard">
        <section className="card wide-card">
          <h2>Пользователь</h2>
          <p>
            <b>{user.name}</b> — {user.email}
          </p>
          <p>Role: {user.role}</p>
        </section>

        <section className="grid two">
          <div className="card">
            <h2>Дети</h2>

            {children.length === 0 && <p>Пока детей нет.</p>}

            {children.length > 0 && (
                <select
                    value={selectedChildId}
                    onChange={(event) => setSelectedChildId(event.target.value)}
                >
                  {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                  ))}
                </select>
            )}

            {selectedChild && (
                <div className="child-box">
                  <h3>
                    {selectedChild.avatar} {selectedChild.name}
                  </h3>

                  <div className="stats">
                    <span>Age: {selectedChild.age}</span>
                    <span>Level: {selectedChild.currentLevel}</span>
                    <span>XP: {selectedChild.xp}</span>
                    <span>Streak: {selectedChild.dailyStreak}</span>
                    <span>Progress: {selectedChild.progressPercent}%</span>
                  </div>

                  {editChild && (
                      <form className="edit-form" onSubmit={handleUpdateChild}>
                        <label>
                          Name
                          <input
                              value={editChild.name}
                              onChange={(event) =>
                                  setEditChild({ ...editChild, name: event.target.value })
                              }
                          />
                        </label>

                        <label>
                          Age
                          <input
                              type="number"
                              min="3"
                              max="8"
                              value={editChild.age}
                              onChange={(event) =>
                                  setEditChild({ ...editChild, age: event.target.value })
                              }
                          />
                        </label>

                        <label>
                          Avatar
                          <input
                              value={editChild.avatar}
                              onChange={(event) =>
                                  setEditChild({ ...editChild, avatar: event.target.value })
                              }
                          />
                        </label>

                        <label>
                          Starting level
                          <input
                              type="number"
                              min="1"
                              max="20"
                              value={editChild.startingLevel}
                              onChange={(event) =>
                                  setEditChild({ ...editChild, startingLevel: event.target.value })
                              }
                          />
                        </label>

                        <div className="button-row">
                          <button className="primary">Сохранить изменения</button>
                          <button type="button" className="danger" onClick={handleDeleteChild}>
                            Удалить ребёнка
                          </button>
                        </div>
                      </form>
                  )}
                </div>
            )}
          </div>

          {!isAdmin && (
              <div className="card">
                <h2>Добавить ребёнка</h2>

                <form onSubmit={handleCreateChild}>
                  <label>
                    Name
                    <input name="name" placeholder="Имя ребёнка" />
                  </label>

                  <label>
                    Age
                    <input name="age" type="number" min="3" max="8" defaultValue="6" />
                  </label>

                  <label>
                    Avatar
                    <input name="avatar" defaultValue="🧒" />
                  </label>

                  <label>
                    Starting level
                    <input
                        name="startingLevel"
                        type="number"
                        min="1"
                        max="20"
                        defaultValue="1"
                    />
                  </label>

                  <button className="primary">Добавить</button>
                </form>
              </div>
          )}

          {isAdmin && (
              <div className="card">
                <h2>Admin actions</h2>
                <p>
                  Админ может изменять и удалять детей. Создание ребёнка через backend разрешено
                  только родителю.
                </p>
              </div>
          )}
        </section>

        {isAdmin && (
            <section className="card wide-card">
              <h2>Создать lesson</h2>

              <form className="admin-form" onSubmit={handleCreateLesson}>
                <label>
                  Unit
                  <select
                      value={lessonForm.unitId}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, unitId: event.target.value })
                      }
                  >
                    <option value="">Выбери unit</option>
                    {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.title}
                        </option>
                    ))}
                  </select>
                </label>

                <label>
                  Title
                  <input
                      value={lessonForm.title}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, title: event.target.value })
                      }
                      placeholder="Например: Letter C"
                  />
                </label>

                <label>
                  Description
                  <input
                      value={lessonForm.description}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, description: event.target.value })
                      }
                      placeholder="Описание урока"
                  />
                </label>

                <label>
                  Lesson type
                  <select
                      value={lessonForm.lessonType}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, lessonType: event.target.value })
                      }
                  >
                    <option value="PHONICS">PHONICS</option>
                    <option value="HANDWRITING">HANDWRITING</option>
                    <option value="SIGHT_WORDS">SIGHT_WORDS</option>
                    <option value="VOCABULARY">VOCABULARY</option>
                  </select>
                </label>

                <label>
                  Difficulty
                  <select
                      value={lessonForm.difficulty}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, difficulty: event.target.value })
                      }
                  >
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </label>

                <label>
                  Base XP
                  <input
                      type="number"
                      min="1"
                      value={lessonForm.baseXp}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, baseXp: event.target.value })
                      }
                  />
                </label>

                <label>
                  Sort order
                  <input
                      type="number"
                      min="1"
                      value={lessonForm.sortOrder}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, sortOrder: event.target.value })
                      }
                  />
                </label>

                <label className="checkbox-label">
                  <input
                      type="checkbox"
                      checked={lessonForm.published}
                      onChange={(event) =>
                          setLessonForm({ ...lessonForm, published: event.target.checked })
                      }
                  />
                  Published
                </label>

                <button className="primary">Создать lesson</button>
              </form>
            </section>
        )}

        <section className="grid two">
          <div className="card">
            <h2>Units</h2>

            <div className="list">
              {units.map((unit) => (
                  <button
                      key={unit.id}
                      className={
                        String(selectedUnitId) === String(unit.id)
                            ? 'list-item selected'
                            : 'list-item'
                      }
                      onClick={() => handleLoadLessons(unit.id)}
                  >
                    <b>{unit.title}</b>
                    <small>{unit.description}</small>
                  </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Lessons</h2>

            {lessons.length === 0 && <p>Выбери unit, чтобы увидеть lessons.</p>}

            <div className="list">
              {lessons.map((lesson) => (
                  <button
                      key={lesson.id}
                      className={
                        selectedLesson?.id === lesson.id ? 'list-item selected' : 'list-item'
                      }
                      onClick={() => handleLoadExercises(lesson)}
                  >
                    <b>{lesson.title}</b>
                    <small>
                      {lesson.lessonType} · {lesson.difficulty} · {lesson.baseXp} XP
                    </small>
                  </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card wide-card">
          <h2>Exercises</h2>

          {!selectedLesson && <p>Выбери lesson.</p>}

          {selectedLesson && (
              <div className="lesson-header">
                <p>
                  Lesson: <b>{selectedLesson.title}</b>
                </p>
                <p>
                  Отправлено ответов: <b>{submittedCount}/{exercises.length}</b>
                </p>
              </div>
          )}

          {isAdmin && selectedLesson && (
              <form className="admin-form compact" onSubmit={handleCreateExercise}>
                <h3>Добавить exercise к выбранному lesson</h3>

                <label>
                  Exercise type
                  <select
                      value={exerciseForm.exerciseType}
                      onChange={(event) =>
                          setExerciseForm({ ...exerciseForm, exerciseType: event.target.value })
                      }
                  >
                    <option value="PHONICS">PHONICS</option>
                    <option value="HANDWRITING">HANDWRITING</option>
                    <option value="SIGHT_WORDS">SIGHT_WORDS</option>
                    <option value="VOCABULARY">VOCABULARY</option>
                  </select>
                </label>

                <label>
                  Prompt
                  <input
                      value={exerciseForm.prompt}
                      onChange={(event) =>
                          setExerciseForm({ ...exerciseForm, prompt: event.target.value })
                      }
                      placeholder="Например: Which letter is C?"
                  />
                </label>

                <label>
                  Correct answer
                  <input
                      value={exerciseForm.correctAnswer}
                      onChange={(event) =>
                          setExerciseForm({ ...exerciseForm, correctAnswer: event.target.value })
                      }
                      placeholder="Например: C"
                  />
                </label>

                <label>
                  Display order
                  <input
                      type="number"
                      min="1"
                      value={exerciseForm.displayOrder}
                      onChange={(event) =>
                          setExerciseForm({ ...exerciseForm, displayOrder: event.target.value })
                      }
                  />
                </label>

                <button className="primary">Создать exercise</button>
              </form>
          )}

          <div className="exercise-list">
            {exercises.map((exercise, index) => {
              const submitted = submittedAnswers[exercise.id];

              return (
                  <div
                      className={
                        submitted
                            ? submitted.correct
                                ? 'exercise correct'
                                : 'exercise wrong'
                            : 'exercise'
                      }
                      key={exercise.id}
                  >
                    <div className="exercise-title">
                      <b>Exercise {index + 1}</b>

                      {!submitted && <span className="status pending">Не отправлено</span>}

                      {submitted && submitted.correct && (
                          <span className="status correct">Правильно</span>
                      )}

                      {submitted && !submitted.correct && (
                          <span className="status wrong">Неправильно</span>
                      )}
                    </div>

                    <p>{exercise.prompt}</p>

                    <div className="answer-row">
                      <input
                          placeholder="Введите ответ"
                          value={answers[exercise.id] || ''}
                          onChange={(event) =>
                              setAnswers({
                                ...answers,
                                [exercise.id]: event.target.value
                              })
                          }
                      />

                      <button onClick={() => handleSubmitAnswer(exercise.id)}>
                        {submitted ? 'Отправить заново' : 'Отправить ответ'}
                      </button>
                    </div>
                  </div>
              );
            })}
          </div>

          {exercises.length > 0 && (
              <button className="primary" onClick={handleCompleteLesson}>
                Завершить урок и начислить XP
              </button>
          )}

          {lessonResult && (
              <div className={lessonResult.success ? 'lesson-result success' : 'lesson-result error'}>
                {lessonResult.success ? (
                    <>
                      <h3>Урок завершён</h3>
                      <p>XP earned: {lessonResult.xpEarned}</p>
                      <p>Stars: {lessonResult.stars}</p>
                      <p>Accuracy: {Math.round(lessonResult.accuracy * 100)}%</p>

                      {lessonResult.newBadges.length > 0 ? (
                          <p>New badges: {lessonResult.newBadges.join(', ')}</p>
                      ) : (
                          <p>New badges: нет новых badges</p>
                      )}
                    </>
                ) : (
                    <>
                      <h3>Урок не завершён</h3>
                      <p>{lessonResult.message}</p>
                    </>
                )}
              </div>
          )}
        </section>

        <section className="grid three">
          <InfoList
              title="Progress"
              items={progress.map(
                  (item) => `${item.lessonTitle}: ${item.xpEarned} XP, ${item.stars} stars`
              )}
          />

          <InfoList
              title="Badges"
              items={badges.map((badge) => `${badge.title} — ${badge.description}`)}
          />

          <InfoList
              title="Notifications"
              items={notifications.map((note) => `${note.title}: ${note.message}`)}
          />
        </section>
      </main>
  );
}

function InfoList({ title, items }) {
  return (
      <div className="card">
        <h2>{title}</h2>

        {items.length === 0 && <p>Пока пусто.</p>}

        <ul className="simple-list">
          {items.map((item, index) => (
              <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
  );
}