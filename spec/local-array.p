program TEST;
var
   v	: array[10..20] of integer;
   j, k	: integer;
   w	:  integer;
   
procedure print;
var i : integer;
    s : array[1..13] of char;
begin
   s[1]	 := 'H';
   s[2]	 := 'e';
   s[3]	 := 'l';
   s[4]	 := 'l';
   s[5]	 := 'o';
   s[6]	 := ',';
   s[7]	 := ' ';
   s[8]	 := 'W';
   s[9]	 := 'o';
   s[10] := 'r';
   s[11] := 'l';
   s[12] := 'd';
   s[13] := '!';

   for i := 1 to 13 do
      write(s[i]);
   writeln();
end;

begin
   k := 121212;
   w := 1717;
   for j := 10 to 20 do begin
      write(v[j]);
      write(', ');
   end;
   writeln();

   print;
   
   for j := 10 to 20 do begin
      v[j] := j*j + 1;
      write(':');
   end;
   writeln();
   
   for k := 1 to 100 do
      for j := 11 to 20 do
	 v[j] := v[j] + v[j-1];

   print;
   print;
   
   for k := 10 to 20 do
      writeln(v[k]);
end.
