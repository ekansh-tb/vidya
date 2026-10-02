-- Placement is independent of curriculum alignment. Existing identity/progress stay intact.
alter table learners add column if not exists learning_placement jsonb;
alter table learners alter column grade drop not null;
alter table learners alter column board drop not null;
update learners set learning_placement = jsonb_build_object(
  'version', 1, 'kind', 'school', 'grade', grade, 'board', board
) where learning_placement is null and grade is not null and board is not null;
alter table learners add constraint learners_placement_consistent check ((
  (grade between 1 and 13 and board is not null and
    learning_placement->>'version' = '1' and learning_placement->>'kind' = 'school' and
    learning_placement->>'grade' = grade::text and learning_placement->>'board' = board)
  or
  (grade is null and board is null and learning_placement->>'version' = '1' and
    learning_placement->>'kind' = 'early-years' and
    learning_placement->>'level' in ('nursery', 'lkg', 'ukg'))
) is true);
-- Old clients may still INSERT school profiles. Canonicalize only that supported shape.
create function canonical_school_placement() returns trigger language plpgsql as $$
begin
  if NEW.learning_placement is null and NEW.grade is not null and NEW.board is not null then
    NEW.learning_placement := jsonb_build_object('version', 1, 'kind', 'school', 'grade', NEW.grade, 'board', NEW.board);
  end if;
  return NEW;
end $$;
create trigger canonical_school_placement before insert on learners for each row execute function canonical_school_placement();
