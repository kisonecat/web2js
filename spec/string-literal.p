program TEST;
const poolsize	     = 20;
type packedASCIIcode = 0..255;
   poolpointer	     = 1..poolsize;

var
   i	   : integer;
   strpool : packed array[poolpointer]of packedASCIIcode;

procedure print;
var i : integer;
begin
   for i := 1 to 13 do
   write(chr(strpool[i]));
   writeln();
end;

begin
   i := 12;
   writeln(i);
   writeln('Hello, world.');
   writeln('This is it.');
   writeln('I can',' ','put',' strings literal inbetween things.');

   strpool[1]	 := ord('H');
   strpool[2]	 := ord('e');
   strpool[3]	 := ord('l');
   strpool[4]	 := ord('l');
   strpool[5]	 := ord('o');
   strpool[6]	 := ord(',');
   strpool[7]	 := ord(' ');
   strpool[8]	 := ord('W');
   strpool[9]	 := ord('o');
   strpool[10] := ord('r');
   strpool[11] := ord('l');
   strpool[12] := ord('d');
   strpool[13] := ord('!');
   print;

end.
