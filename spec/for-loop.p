program TEST;
var
  i : integer;
   k : 0..255;
begin
   for i := 50 to 60 do
      writeln(i);
   for i := 80 downto 70 do
      writeln(i);
   for k := 0 to 255 do
      writeln(k);
   
   for k := 17 to 17 do
      writeln(k);

   for i := 10 to 11 do
      writeln(i);

   for i := 10 downto 11 do
      writeln(i);

   for i := 120 downto 120 do
      writeln(i);   

   for i := 110 downto 100 do
      writeln(i);            
end.
