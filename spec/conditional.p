program TEST;
var
  i : integer;
   
begin
   i := 17;
   if i > 15 then
      writeln(12)
   else
      writeln(15);
   i := 100;
   if i < 15 then
      writeln(13)
   else
      writeln(19);
   if 1 <> 1 then
      if 1 = 1 then
	 writeln(1212)
      else writeln(1313)
   else writeln(1414);
   if 1 = 1 then
      if 1 <> 1 then
	 writeln(1212)
      else writeln(1313)
   else writeln(1414);
   if 1 <> 1 then
      if 1 <> 1 then
	 writeln(1212)
      else writeln(1313)
   else writeln(1414);      
   if 1 = 1 then
      if 1 = 1 then
	 writeln(1212)
      else writeln(1313)
   else writeln(1414);
   if 1 = 1 then
      if 1 <> 1 then
	 writeln(1234)
      else writeln(4321);
   if 1 <> 1 then
      if 1 = 1 then
	 writeln(1234)
      else writeln(4321);
   if 1 <> 1 then
      if 1 <> 1 then
	 writeln(1234)
      else writeln(4321);
end.
