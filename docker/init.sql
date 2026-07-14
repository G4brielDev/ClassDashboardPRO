CREATE TABLE IF NOT EXISTS classroom_state (
  id INTEGER PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO classroom_state (id, data)
VALUES (
  1,
  jsonb_build_object(
    'version', 1,
    'revision', 1,
    'lastUpdated', to_char(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
    'school', jsonb_build_object('schoolName', '', 'classroomName', '', 'teacherName', '', 'subjectName', '', 'logoDataUrl', ''),
    'lesson', jsonb_build_object('title', '', 'description', '', 'startTime', '', 'endTime', '', 'status', 'aguardando', 'notes', '', 'currentActivity', NULL, 'nextActivity', NULL),
    'agenda', jsonb_build_array(),
    'notices', jsonb_build_array(),
    'tasks', jsonb_build_array(),
    'birthdays', jsonb_build_array(),
    'timer', jsonb_build_object('durationSeconds', 1500, 'elapsedBeforeStart', 0, 'startedAt', NULL, 'pausedAt', NULL, 'status', 'stopped', 'warnedFiveMinutes', false, 'warnedOneMinute', false),
    'appearance', jsonb_build_object('theme', 'school-blue', 'mode', 'light', 'fontScale', 1, 'radius', 'rounded', 'density', 'comfortable', 'animations', true),
    'display', jsonb_build_object('layout', 'complete', 'showSeconds', true, 'clockFormat', '24h', 'showDate', true, 'showTeacher', true, 'showSubject', true, 'showAgenda', true, 'showTasks', true, 'showBirthdays', true, 'showMessage', true, 'dailyMessage', '', 'rotateNotices', true, 'noticeRotationSeconds', 8, 'soundsEnabled', false, 'volume', 0.5, 'controlsAutoHideSeconds', 6, 'keepAwake', true),
    'history', jsonb_build_array(),
    'pin', jsonb_build_object('enabled', false, 'hash', '')
  )
)
ON CONFLICT (id) DO NOTHING;
