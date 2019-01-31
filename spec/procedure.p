program TEST;
var
  i : integer;

procedure foo;
begin
   writeln(17);
end;

begin
   writeln(12);
   foo;
   writeln(19);
   foo;
   writeln(20);
end.
