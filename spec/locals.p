program TEST;
var
  i : integer;

procedure foo(x, y : integer) ;
 var
    i,j : integer;
begin
   j := 17;
   i := 0;
   i := x + 2*y + i;
   x := 3*x + 2*y + i;
   j := x+y+y*i;
   y := 3*x + 2*y + i - j;
   i := 6*x - 2*y + i + j;
   writeln(i);
   writeln(j);   
end;

begin
   i := 3;
   writeln(5);
   foo(3,14*i);
   writeln(19);
   foo(5,19);
   writeln(20);
end.
