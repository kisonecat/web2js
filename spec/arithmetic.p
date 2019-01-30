program TEST;
var
   i : integer;
   j : integer;
   
begin
   i := 17;
   j := 18*i - 100000;
   i := -j*i;
   j := j+i+3*(i-j);
   writeln(i);   
   writeln(j);
end.
