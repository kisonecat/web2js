program TEST;
var
  i : integer;

procedure foo(a, b : integer) ;
begin
   writeln(b*3 + 1 - 17*a);
end;

begin
   i := 3;
   writeln(5);
   foo(3,14*i);
   writeln(19);
   foo(5,19);
   writeln(20);
end.
